const $ = require('cheerio');
const MarketModel = require('./models/marketModel');
const Simulator = require('./models/simulatorModel');
const AdinSettings = require('./models/adminSettingsModel');
const mongoose = require('mongoose');
var schedule = require('node-schedule');
const cluster = require('cluster');
const rp = require('request-promise');
require('dotenv').config();
const boll = require('bollinger-bands');

//Connection to DataBase:
//To connect to Development environment DB (Comment line below if not using it)
/*mongoose.connect('mongodb://localhost:27017/Tradheo', {
  useNewUrlParser: true
});*/

//To connect to DB in cloud:
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true
});

mongoose.connection.on('error', error => console.log(error));
mongoose.Promise = global.Promise;

scraper = (companies, html) => {
  $(
    "table[class='genTbl closedTbl crossRatesTbl elpTbl elp30'] > tbody > tr",
    html
  ).each((i, elem) => {
    companies.push({
      name: $("td[class='bold left noWrap elp plusIconTd'] > a", html)
        .eq(i)
        .html(),
      last: $('td', elem)
        .eq(2)
        .text(),
      high: $('td', elem)
        .eq(3)
        .text(),
      low: $('td', elem)
        .eq(4)
        .text(),
      change: $('td', elem)
        .eq(5)
        .text(),
      changePerCent: $('td', elem)
        .eq(6)
        .text(),
      volume: $('td', elem)
        .eq(7)
        .text(),
      time: $('td', elem)
        .eq(8)
        .text(),
      purchase: false,
      sale: false
    });
  });

  return companies;
};

systemFirstConditionPurchase = async (country, company, minutes) => {
  const aggregateData = await MarketModel.aggregate([{
        $unwind: '$companies'
      },
      {
        $match: {
          country: country,
          'companies.name': company
        }
      },

      {
        $group: {
          _id: {
            $toDate: {
              $subtract: [{
                  $toLong: {
                    $toDate: '$date'
                  }
                },
                {
                  $mod: [{
                      $toLong: {
                        $toDate: '$date'
                      }
                    },
                    1000 * 60 * minutes
                  ]
                }
              ]
            }
          },
          last: {
            $last: '$companies.last'
          }
        }
      }
    ])
    .limit(70)
    .sort({
      _id: 1
    })
    .exec();

  aggregateData.pop();

  var closePrice = aggregateData[aggregateData.length - 1].last;

  var dataForBollinger = [];
  aggregateData.forEach(x => {
    dataForBollinger.push(x.last);
  });

  var bollingerResult = boll(dataForBollinger, 69, 2);
  var i = bollingerResult.lower.length - 1;
  var lowerBand = Math.round(bollingerResult.lower[i] * 1000) / 1000;

  if (closePrice < lowerBand) {
    return true;
  } else {
    return false;
  }
};

systemSecondConditionPurchase = async (country, company, minutes) => {
  const aggregateData = await MarketModel.aggregate([{
        $unwind: '$companies'
      },
      {
        $match: {
          country: country,
          'companies.name': company
        }
      },

      {
        $group: {
          _id: {
            $toDate: {
              $subtract: [{
                  $toLong: {
                    $toDate: '$date'
                  }
                },
                {
                  $mod: [{
                      $toLong: {
                        $toDate: '$date'
                      }
                    },
                    1000 * 60 * minutes
                  ]
                }
              ]
            }
          },
          last: {
            $first: '$companies.last'
          }
        }
      }
    ])
    .limit(69)
    .sort({
      _id: 1
    })
    .exec();

  var openPrice = aggregateData[aggregateData.length - 1].last;

  var dataForBollinger = [];
  aggregateData.forEach(x => {
    dataForBollinger.push(x.last);
  });

  var bollingerResult = boll(dataForBollinger, 69, 2);
  var i = bollingerResult.lower.length - 1;
  var lowerBand = Math.round(bollingerResult.lower[i] * 1000) / 1000;

  if (openPrice < lowerBand) {
    return true;
  } else {
    return false;
  }
};

systemThirdConditionPurchase = async (
  country,
  company,
  currentPrice,
  minutes
) => {
  const aggregateData = await MarketModel.aggregate([{
        $unwind: '$companies'
      },
      {
        $match: {
          country: country,
          'companies.name': company
        }
      },

      {
        $group: {
          _id: {
            $toDate: {
              $subtract: [{
                  $toLong: {
                    $toDate: '$date'
                  }
                },
                {
                  $mod: [{
                      $toLong: {
                        $toDate: '$date'
                      }
                    },
                    1000 * 60 * minutes
                  ]
                }
              ]
            }
          },
          last: {
            $last: '$companies.last'
          }
        }
      }
    ])
    .limit(69)
    .sort({
      _id: 1
    })
    .exec();

  var dataForBollinger = [];
  aggregateData.forEach(x => {
    dataForBollinger.push(x.last);
  });

  var bollingerResult = boll(dataForBollinger, 69, 2);
  var i = bollingerResult.lower.length - 1;
  var lowerBand = Math.round(bollingerResult.lower[i] * 1000) / 1000;
  var midBand = Math.round(bollingerResult.mid[i] * 1000) / 1000;

  var result = {};

  if (currentPrice >= lowerBand) {
    result.condition = true;
    result.lossDistance = Math.round(((midBand - lowerBand) / 2) * 1000) / 1000;
    return result;
  } else {
    result.condition = false;
    return result;
  }
};

hasAlreadySimulator = async company => {
  const simulator = await Simulator.findOne({
    username: null,
    company: company,
    result: null
  }).exec();

  if (simulator === null) {
    return false;
  } else {
    return true;
  }
};

returnSimulator = async company => {
  const simulator = await Simulator.findOne({
    username: null,
    company: company,
    result: null
  }).exec();

  return simulator;
};

returnAdminSettings = async () => {
  const adminSettings = await AdinSettings.findOne({}).exec();

  return adminSettings;
};

getMidBand = async (country, company, minutes) => {
  const aggregateData = await MarketModel.aggregate([{
        $unwind: '$companies'
      },
      {
        $match: {
          country: country,
          'companies.name': company
        }
      },

      {
        $group: {
          _id: {
            $toDate: {
              $subtract: [{
                  $toLong: {
                    $toDate: '$date'
                  }
                },
                {
                  $mod: [{
                      $toLong: {
                        $toDate: '$date'
                      }
                    },
                    1000 * 60 * minutes
                  ]
                }
              ]
            }
          },
          last: {
            $last: '$companies.last'
          }
        }
      }
    ])
    .limit(69)
    .sort({
      _id: 1
    })
    .exec();

  var dataForBollinger = [];
  aggregateData.forEach(x => {
    dataForBollinger.push(x.last);
  });

  var bollingerResult = boll(dataForBollinger, 69, 2);
  var i = bollingerResult.lower.length - 1;
  var midBand = Math.round(bollingerResult.mid[i] * 1000) / 1000;

  return midBand;
};

removeOldData = async () => {
  var olderThan = new Date();
  olderThan.setDate(olderThan.getDate() - 7);

  const remove = await MarketModel.find({
      date: {
        $lte: olderThan
      }
    })
    .remove()
    .exec();

  return remove;
};

getMarketData = async workerId => {
  console.log('Starting web scraping job');
  const adminSettings = await returnAdminSettings();

  if (workerId % 2 === 1) {
    rp({
        uri: 'https://uk.investing.com/equities/spain',
        headers: {
          'User-Agent': 'Request-Promise'
        }
      })
      .then(async html => {
        let companies = [];
        companies = scraper(companies, html);
        MarketModel.create({
            country: 'Spain',
            name: 'IBEX 35',
            companies
          },
          err => {
            if (err) return console.log(err);
            console.log(
              'Spanish market data saved (Worker: ' + workerId.toString() + ')'
            );
          }
        );
        //Check purchase System
        if (adminSettings.country === 'Spain') {
          const company = await companies.find(
            x => x.name === adminSettings.company
          );
          try {
            const existsOperation = await hasAlreadySimulator(company.name);
            if (!existsOperation && workerId === 1) {
              const purchase1Cond = await systemFirstConditionPurchase(
                'Spain',
                company.name,
                adminSettings.minutes
              );
              if (purchase1Cond) {
                console.log('First condition passed for ' + company.name);
                const purchase2Cond = await systemSecondConditionPurchase(
                  'Spain',
                  company.name,
                  adminSettings.minutes
                );
                if (purchase2Cond) {
                  console.log('Second condition passed for ' + company.name);
                  const purchase3Cond = await systemThirdConditionPurchase(
                    'Spain',
                    company.name,
                    company.last,
                    adminSettings.minutes
                  );
                  if (purchase3Cond.condition) {
                    console.log('Third condition passed for ' + company.name);
                    Simulator.create({
                      username: null,
                      company: company.name,
                      country: 'Spain',
                      number: Math.floor(500 / company.last),
                      purchaseValue: company.last,
                      saleDate: null,
                      saleValue: null,
                      result: null,
                      lossClosure: Math.round(
                        (company.last - purchase3Cond.lossDistance) * 1000
                      ) / 1000
                    });
                  } else {
                    console.log(
                      'Not matching 3rd condition for ' + company.name
                    );
                  }
                } else {
                  console.log('Not matching 2nd condition for ' + company.name);
                }
              } else {
                console.log('Not matching 1st condition for ' + company.name);
              }
            } else if (existsOperation) {
              const simulator = await returnSimulator(company.name);
              if (company.last <= simulator.lossClosure) {
                console.log('Closing simulation with loss');
                simulator.saleDate = new Date();
                simulator.saleValue = company.last;
                simulator.result =
                  Math.round(
                    (company.last * simulator.number -
                      simulator.purchaseValue * simulator.number) *
                    1000
                  ) / 1000;
                simulator.save();
              } else {
                const mid = await getMidBand(
                  'Spain',
                  company.name,
                  adminSettings.minutes
                );
                if (company.last >= mid) {
                  console.log('Closing simulation with benefit');
                  simulator.saleDate = new Date();
                  simulator.saleValue = company.last;
                  simulator.result =
                    Math.round(
                      (company.last * simulator.number -
                        simulator.purchaseValue * simulator.number) *
                      1000
                    ) / 1000;
                  simulator.save();
                }
              }
            }
          } catch (err) {
            console.log(err);
          }
        }
        const now = new Date();
        //Checks that time is before 17:35 (close of the stock exchange)
        if (
          now.getHours() <= 17 &&
          !(now.getHours() == 17 && now.getMinutes() > 59)
        ) {
          return getMarketData(workerId);
        } else {
          console.log(
            "Today's scraping job finished (Worker: " +
            workerId.toString() +
            ')'
          );
          if (workerId === 1) {
            const remove = await removeOldData();
            console.log('Removed all data from DB');
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    rp({
        uri: 'https://uk.investing.com/equities/germany',
        headers: {
          'User-Agent': 'Request-Promise'
        }
      })
      .then(async html => {
        let companies = [];
        companies = scraper(companies, html);
        MarketModel.create({
            country: 'Germany',
            name: 'DAX',
            companies
          },
          err => {
            if (err) return console.log(err);
            console.log(
              'German market data saved (Worker: ' + workerId.toString() + ')'
            );
          }
        );
        //Check purchase System
        if (adminSettings.country === 'Germany') {
          const company = await companies.find(
            x => x.name === adminSettings.company
          );
          try {
            const existsOperation = await hasAlreadySimulator(company.name);
            if (!existsOperation && workerId === 2) {
              const purchase1Cond = await systemFirstConditionPurchase(
                'Germany',
                company.name,
                adminSettings.minutes
              );
              if (purchase1Cond) {
                console.log('First condition passed for ' + company.name);
                const purchase2Cond = await systemSecondConditionPurchase(
                  'Germany',
                  company.name,
                  adminSettings.minutes
                );
                if (purchase2Cond) {
                  console.log('Second condition passed for ' + company.name);
                  const purchase3Cond = await systemThirdConditionPurchase(
                    'Germany',
                    company.name,
                    company.last,
                    adminSettings.minutes
                  );
                  if (purchase3Cond.condition) {
                    console.log('Third condition passed for ' + company.name);
                    Simulator.create({
                      username: null,
                      company: company.name,
                      country: 'Germany',
                      number: Math.floor(500 / company.last),
                      purchaseValue: company.last,
                      saleDate: null,
                      saleValue: null,
                      result: null,
                      lossClosure: company.last - purchase3Cond.lossDistance
                    });
                  } else {
                    console.log(
                      'Not matching 3rd condition for ' + company.name
                    );
                  }
                } else {
                  console.log('Not matching 2nd condition for ' + company.name);
                }
              } else {
                console.log('Not matching 1st condition for ' + company.name);
              }
            } else if (existsOperation) {
              const simulator = await returnSimulator(company.name);
              if (company.last <= simulator.lossClosure) {
                simulator.saleDate = new Date();
                simulator.saleValue = company.last;
                simulator.result =
                  Math.round(
                    (company.last * simulator.number -
                      simulator.purchaseValue * simulator.number) *
                    1000
                  ) / 1000;
                simulator.save();
              } else {
                const mid = await getMidBand(
                  'Germany',
                  company.name,
                  adminSettings.minutes
                );
                if (company.last >= mid) {
                  simulator.saleDate = new Date();
                  simulator.saleValue = company.last;
                  simulator.result =
                    Math.round(
                      (company.last * simulator.number -
                        simulator.purchaseValue * simulator.number) *
                      1000
                    ) / 1000;
                  simulator.save();
                }
              }
            }
          } catch (err) {
            console.log(err);
          }
        }
        const now = new Date();
        //Checks that time is before 17:35 (close of the stock exchange)
        if (
          now.getHours() <= 17 &&
          !(now.getHours() == 17 && now.getMinutes() > 59)
        ) {
          return getMarketData(workerId);
        } else {
          console.log(
            "Today's scraping job finished (Worker: " +
            workerId.toString() +
            ')'
          );
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
};

if (cluster.isMaster) {
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
} else {
  const nowForHeroku = new Date();
  if (nowForHeroku.getDay() > 0 && nowForHeroku.getDay() < 6) {
    if (cluster.worker.id < 3) {
      getMarketData(cluster.worker.id);
    } else {
      setTimeout(() => {
        getMarketData(cluster.worker.id);
      }, 2500);
    }
  }

  var j = schedule.scheduleJob('55 8 * * 1-5', function () {
    if (cluster.worker.id < 3) {
      getMarketData(cluster.worker.id);
    } else {
      setTimeout(() => {
        getMarketData(cluster.worker.id);
      }, 2500);
    }
  });
}