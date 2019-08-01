const $ = require('cheerio');
const MarketModel = require('./models/marketModel');
const mongoose = require('mongoose');
var schedule = require('node-schedule');
const cluster = require('cluster');
const rp = require('request-promise');
require('dotenv').config();

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

getMarketData = async (workerId) => {
  console.log('Starting web scraping job');

  if (workerId % 2 === 1) {
    rp({
      uri: 'https://uk.investing.com/equities/spain',
      headers: {
        'User-Agent': 'Request-Promise'
      }
    }).then(html => {
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
            'Spanish market data saved (Worker: ' +
            workerId.toString() +
            ')'
          );
        }
      );
      const now = new Date();
      //Checks that time is before 17:35 (close of the stock exchange)
      if (
        now.getHours() <= 17 &&
        !(now.getHours() == 17 && now.getMinutes() > 35)
      ) {
        return getMarketData(workerId);
      }
    }).catch(err => {
      console.log(err);
    })
  } else {
    rp({
      uri: 'https://uk.investing.com/equities/germany',
      headers: {
        'User-Agent': 'Request-Promise'
      }
    }).then(html => {
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
            'German market data saved (Worker: ' +
            workerId.toString() +
            ')'
          );
        }
      );
      const now = new Date();
      //Checks that time is before 17:35 (close of the stock exchange)
      if (
        now.getHours() <= 17 &&
        !(now.getHours() == 17 && now.getMinutes() > 35)
      ) {
        return getMarketData(workerId);
      }
    }).catch(err => {
      console.log(err);
    })
  }
};



if (cluster.isMaster) {
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
} else {
  var j = schedule.scheduleJob('59 16 * * 1-5', function () {
    if (cluster.worker.id < 3) {
      getMarketData(cluster.worker.id);
    } else {
      setTimeout(() => {
        getMarketData(cluster.worker.id);
      }, 2500)
    }

  });

}