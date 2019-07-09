const rp = require('request-promise');
const $ = require('cheerio');
const MarketModel = require('./models/marketModel');
const mongoose = require('mongoose');

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
    console.log("Web scrapping to get market data...")

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

    rp({
        uri: 'https://uk.investing.com/equities/spain',
        headers: {
            'User-Agent': 'Request-Promise'
        }
    }).then(html => {
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

        rp({
            uri: 'https://uk.investing.com/equities/germany',
            headers: {
                'User-Agent': 'Request-Promise'
            }
        }).then(html => {
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


        }).catch(error => {
            console.log(error);
        })



    }).catch(err => {
        console.log(err);
    })
}

getMarketData();