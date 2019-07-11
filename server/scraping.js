const $ = require('cheerio');
const MarketModel = require('./models/marketModel');
const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
var schedule = require('node-schedule');

//Connection to DataBase:
//To connect to Development environment DB (Comment line below if not using it)
mongoose.connect('mongodb://localhost:27017/Tradheo', {
    useNewUrlParser: true
});

//To connect to DB in cloud:
//mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

mongoose.connection.on('error', error => console.log(error));
mongoose.Promise = global.Promise;

getMarketData = async () => {
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

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://uk.investing.com/equities/spain', {
            timeout: 3000000,
            waitUntil: 'networkidle2'
        });
        const html = await page.content();
        console.log('Spain data page content loaded');
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

        await page.goto('https://uk.investing.com/equities/germany', {
            timeout: 3000000,
            waitUntil: 'networkidle2'
        });
        const html2 = await page.content();
        console.log('Germany data page content loaded');
        $("table[class='genTbl closedTbl crossRatesTbl elpTbl elp30'] > tbody > tr", html2).each((i, elem) => {
            marketGermany.companies.push({
                name: $("td[class='bold left noWrap elp plusIconTd'] > a", html2).eq(i).html(),
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
        await browser.close();
        markets.push(marketGermany);

        MarketModel.create({
            markets,
        }, (err) => {
            if (err) return handleError(err);
        })

        console.log("Done!")

    } catch (err) {
        console.log(err);
    }
}


var j = schedule.scheduleJob('*/10 * 8-18 * * 1-5', function () {
    getMarketData();
});
/*
const now = new Date();
//Checks that time is between 8:30 - 17:35 (schedule of the stock exchange)
if (now.getHours() >= 8 && !(now.getHours() == 8 && now.getMinutes() < 30) && now.getHours() <= 17 && !(now.getHours() == 17 && now.getMinutes() > 35)) {
    getMarketData();
}
*/