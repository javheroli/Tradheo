const $ = require('cheerio');
const MarketModel = require('./models/marketModel');
const mongoose = require('mongoose');
const puppeteer = require('puppeteer');

//Connection to DataBase:
//To connect to Development environment DB (Comment line below if not using it)
mongoose.connect('mongodb://localhost:27017/Tradheo', {
    useNewUrlParser: true
});

//To connect to DB in cloud:
//mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

mongoose.connection.on('error', error => console.log(error));
mongoose.Promise = global.Promise;

getMarketData = function () {
    console.log("Web scraping to get market data...")

    let markets = []
    let marketSpain = {
        country: 'Spain',
        name: 'IBEX 35',
        companies: []
    }
    let marketGermany = {
        country: 'Germany',
        name: 'DAX',
        companies: []
    }

    puppeteer
        .launch()
        .then(function (browser) {
            return browser.newPage();
        })
        .then(function (page) {
            return page.goto('https://uk.investing.com/equities/spain').then(function () {
                return page.content();
            });
        })
        .then(function (html) {
            $("table[class='genTbl closedTbl crossRatesTbl elpTbl elp30'] > tbody > tr", html).each((i, elem) => {
                marketSpain.companies.push({
                    name: $("td[class='bold left noWrap elp plusIconTd'] > a", html).eq(i).html(),
                    last: $("td", elem).eq(2).text(),
                    high: $("td", elem).eq(3).text(),
                    low: $("td", elem).eq(4).text(),
                    change: $("td", elem).eq(5).text(),
                    changePerCent: $("td", elem).eq(6).text(),
                    volume: $("td", elem).eq(7).text(),
                    time: $("td", elem).eq(8).text(),
                    purchase: false,
                    sale: false
                });
            });
            markets.push(marketSpain);

            puppeteer
                .launch()
                .then(function (browser) {
                    return browser.newPage();
                })
                .then(function (page) {
                    return page.goto('https://uk.investing.com/equities/germany').then(function () {
                        return page.content();
                    });
                })
                .then(function (html) {
                    $("table[class='genTbl closedTbl crossRatesTbl elpTbl elp30'] > tbody > tr", html).each((i, elem) => {
                        marketGermany.companies.push({
                            name: $("td[class='bold left noWrap elp plusIconTd'] > a", html).eq(i).html(),
                            last: $("td", elem).eq(2).text(),
                            high: $("td", elem).eq(3).text(),
                            low: $("td", elem).eq(4).text(),
                            change: $("td", elem).eq(5).text(),
                            changePerCent: $("td", elem).eq(6).text(),
                            volume: $("td", elem).eq(7).text(),
                            time: $("td", elem).eq(8).text(),
                            purchase: false,
                            sale: false
                        });
                    });
                    markets.push(marketGermany)

                    MarketModel.create({
                        markets,
                    }, (err) => {
                        if (err) return handleError(err);
                    })

                    console.log("Done!")
                })
                .catch(function (err) {
                    console.log(err);
                });

        })
        .catch(function (err) {
            console.log(err);
        });
}

getMarketData();