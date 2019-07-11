const $ = require('cheerio');
const MarketModel = require('./models/marketModel');
const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
var schedule = require('node-schedule');
const {
    Cluster
} = require('puppeteer-cluster');


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


    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 2,
    });

    await cluster.task(async ({
        page,
        data: url
    }) => {
        await page.goto(url, {
            timeout: 3000000,
            waitUntil: 'networkidle2'
        });
        const html = await page.content();
        if (url === 'https://uk.investing.com/equities/spain') {
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
        } else {
            console.log('Germany data page content loaded');
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
            markets.push(marketGermany);
        }
        if (markets.length === 2) {
            MarketModel.create({
                markets,
            }, (err) => {
                if (err) return handleError(err);
            })

            console.log("Done!")
        }
    });

    cluster.queue('https://uk.investing.com/equities/spain');
    cluster.queue('https://uk.investing.com/equities/germany');

    await cluster.idle();
    await cluster.close();

}


var j = schedule.scheduleJob('*/10 * 8-17 * * 1-5', function () {
    const now = new Date();
    //Checks that time is between 8:30 - 17:35 (schedule of the stock exchange)
    if (now.getHours() >= 8 && !(now.getHours() == 8 && now.getMinutes() < 30) && now.getHours() <= 17 && !(now.getHours() == 17 && now.getMinutes() > 35)) {
        getMarketData();
    }
});