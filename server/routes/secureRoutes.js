const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Market = require('../models/marketModel');
require('dotenv').config();
const rp = require('request-promise');


const companyToSymbol = {
    //IBEX 35
    'Acciona': 'ANA.MC',
    'Acerinox': 'ACX.MC',
    'ACS': 'ACS.MC',
    'Aena': 'AENA.MC',
    'Amadeus': 'AMS.MC',
    'ArcelorMittal': 'MTS.MC',
    'B. Sabadell': 'SAB.MC',
    'Bankia': 'BKIA.MC',
    'Bankinter': 'BKT.MC',
    'BBVA': 'BBVA.MC',
    'Caixabank': 'CABK.MC',
    'Cellnex Telecom': 'CLNX.MC',
    'Cie Automotive': 'CIE.MC',
    'Enagas': 'ENG.MC',
    'ENCE': 'ENC.MC',
    'Endesa': 'ELE.MC',
    'Ferrovial': 'FER.MC',
    'Gamesa': 'SGRE.MC',
    'Grifols': 'GRF.MC',
    'IAG': 'IAG.MC',
    'Iberdrola': 'IBE.MC',
    'Inditex': 'ITX.MC',
    'Indra A': 'IDR.MC',
    'Inmobiliaria Colonial': 'COL.MC',
    'Mapfre': 'MAP.MC',
    'Masmovil Ibercom': 'MAS.MC',
    'Mediaset': 'TL5.MC',
    'Melia Hotels': 'MEL.MC',
    'Merlin Properties SA': 'MRL.MC',
    'Naturgy Energy': 'NTGY.MC',
    'Red Electrica': 'REE.MC',
    'Repsol': 'REP.MC',
    'Santander': 'SAN.MC',
    'Telefonica': 'TEF.MC',
    'Viscofan': 'VIS.MC',

    //DAX
    'Adidas': 'ADS.DE',
    'Allianz': 'ALV.DE',
    'BASF': 'BAS.DE',
    'Bayer': 'BAYN.DE',
    'Beiersdorf AG': 'BEI.DE',
    'BMW ST': 'BMW.DE',
    'Continental AG': 'CON.DE',
    'Covestro': '1COV.DE',
    'Daimler': 'DAI.DE',
    'Deutsche Bank AG': 'DBK.DE',
    'Deutsche Boerse': 'DB1.DE',
    'Deutsche Post': 'DPW.DE',
    'Deutsche Telekom AG': 'DTE.DE',
    'E.ON SE': 'EOAN.DE',
    'Fresenius SE': 'FRE.DE',
    'Fresenius ST': 'FME.DE',
    'Heidelbergcement': 'HEI.DE',
    'Henkel VZO': 'HEN3.DE',
    'Infineon': 'IFX.DE',
    'Linde PLC': 'LIN.DE',
    'Lufthansa': 'LHA.DE',
    'Merck': 'MRK.DE',
    'Muench. Rueckvers.': 'MUV2.DE',
    'RWE AG ST': 'RWE.DE',
    'SAP': 'SAP.DE',
    'Siemens AG': 'SIE.DE',
    'Thyssenkrupp AG': 'TKA.DE',
    'Volkswagen VZO': 'VOW3.DE',
    'Vonovia': 'VNA.DE',
    'Wirecard AG': 'WDI.DE',
}

//API Route /api/getUserLogged/
//GET: Getting all users from DB
router.route('/getUserLogged').get((req, res) => {
    var id = req.user._id;
    User.findById(id, (err, user) => {
        res.json(user);
        console.log('Getting the user logged');
        res.end();
    });
});

//API Route /api/market/live/:country
//GET: Getting live market data for the selected country
router.route('/market/live/:country').get((req, res) => {
    var country = req.params.country;

    Market.findOne({
        country: country
    }, {
        _id: 0
    }).sort({
        date: -1
    }).exec((err, market) => {
        if (err) {
            res.status(500).send('Error getting live market data for the country ' + country)
        } else {
            res.json(
                market

            );
            console.log(
                'Getting live market data for the country ' + country
            );
            res.end();
        }

    });
});

//API Route /api/chart/getData
//GET: Getting data from Alpha Vantage to show company's information in charts
router.route('/chart/getData/:company/:interval').get((req, res) => {
    var company = req.params.company;
    var interval = req.params.interval;

    const symbol = companyToSymbol[company];
    if (symbol === undefined) {
        res.status(404).send('Company not found');
        return null;
    }
    var functionType;
    var functionKey;
    var intervalForUrl = '';
    var outputSize = '';
    switch (interval) {
        case '1W':
            functionType = 'TIME_SERIES_WEEKLY';
            functionKey = 'Weekly Time Series';

            break;
        case '1M':
            functionType = 'TIME_SERIES_MONTHLY';
            functionKey = 'Monthly Time Series';
            break;
        case '1m':
            functionType = 'TIME_SERIES_INTRADAY';
            intervalForUrl = '&interval=1min';
            outputSize = '&outputsize=full';
            functionKey = 'Time Series (1min)';
            break;
        case '5m':
            functionType = 'TIME_SERIES_INTRADAY';
            intervalForUrl = '&interval=5min';
            functionKey = 'Time Series (5min)';
            outputSize = '&outputsize=full';
            break;
        case '15m':
            functionType = 'TIME_SERIES_INTRADAY';
            intervalForUrl = '&interval=15min';
            functionKey = 'Time Series (15min)';
            outputSize = '&outputsize=full';
            break;
        case '30m':
            functionType = 'TIME_SERIES_INTRADAY';
            functionKey = 'Time Series (30min)';
            intervalForUrl = '&interval=30min';
            functionKey = 'Time Series (30min)';
            outputSize = '&outputsize=full';
            break;
        case '1h':
            functionType = 'TIME_SERIES_INTRADAY';
            intervalForUrl = '&interval=60min';
            functionKey = 'Time Series (60min)';
            outputSize = '&outputsize=full';
            break;
        case '1D':
            functionKey = 'Time Series (Daily)';
            functionType = 'TIME_SERIES_DAILY';
            //outputSize = '&outputsize=full';
            break;
        default:
            res.status(400).send('Bad interval introduced');
            return null;
    }
    url = 'https://www.alphavantage.co/query?function=' + functionType + '&symbol=' + symbol + intervalForUrl + outputSize + '&apikey=' + process.env.ALPHAVANTAGE_KEY;
    rp({
        uri: url,
        json: true,
        headers: {
            'User-Agent': 'Request-Promise'
        }
    }).then(data => {
        var result = [];
        try {
            const dateStrings = Object.keys(data[functionKey]);
            const valuesObject = Object.values(data[functionKey]);
            var i = 0;
            dateStrings.forEach((dateString) => {
                var array = [];
                if (functionType === 'TIME_SERIES_INTRADAY') {
                    var hour = parseInt(dateString.substring(11, 13)) + 6;
                    if (hour >= 10) {
                        hour = hour.toString();
                    } else {
                        hour = '0' + hour.toString();
                    }
                    var dateString = dateString.substring(0, 11) + hour + dateString.substring(13, 19);
                }

                var date = new Date(dateString).getTime();
                array.push(date);
                array.push(parseFloat(valuesObject[i]["1. open"]));
                array.push(parseFloat(valuesObject[i]["2. high"]));
                array.push(parseFloat(valuesObject[i]["3. low"]));
                array.push(parseFloat(valuesObject[i]["4. close"]));

                result.unshift(array);
                i++;
            })

            res.json(result);
            console.log("Getting data to show company's information in chart (Company: " + company + ", interval: " + interval + ")");
            res.end();
        } catch (err) {
            res.status(503).send('Reached alpha vantage api limitations');
            return null;
        }

    })
});

module.exports = router;