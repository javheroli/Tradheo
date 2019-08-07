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

//API Route /api/getUser/:username
//GET: Getting all users from DB
router.route('/getUser/:username').get((req, res) => {
    var username = req.params.username;
    User.findOne({
        username: username
    }, (err, user) => {
        if (err) {
            res.status(404).send('User with username ' + username + ' not found');
        } else {
            res.json(user);
            console.log('Getting user by username: ' + username);
            res.end();
        }
    });
});


//API Route /api/deleteUser
//GET: Mark user account as deleted
router.route('/deleteUser').get((req, res) => {
    var id = req.user._id;
    User.findByIdAndUpdate(id, {
        isDeleted: true
    }, (err, user) => {
        res.status(204).send();
    });
});

//Route  /api/editUser
//Edit user personal data
router.route('/editUser').post((req, res) => {
    var id = req.user._id;
    var username = req.body.username;
    var email = req.body.email;
    var phoneNumber = req.body.phoneNumber;
    var birthdate = req.body.birthdate;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var description = req.body.description;
    var country = req.body.country;
    var city = req.body.city;

    if (req.file !== undefined) {
        var image = req.file.url;
        User.findByIdAndUpdate(id, {
            username: username,
            email: email,
            phoneNumber: phoneNumber,
            birthdate: birthdate,
            firstName: firstName,
            lastName: lastName,
            description: description,
            country: country,
            city: city,
            image: image
        }, (err, user) => {
            if (err) {
                return res.status(500).send()
            }
            res.json(user);
        });
    } else {
        User.findByIdAndUpdate(id, {
            username: username,
            email: email,
            phoneNumber: phoneNumber,
            birthdate: birthdate,
            firstName: firstName,
            lastName: lastName,
            description: description,
            country: country,
            city: city,
        }, (err, user) => {
            if (err) {
                return res.status(500).send()
            }
            res.json(user);
        });
    }

});

//Route  /api/editUser/validationUsername/:username
//Username validation for edit user
router.route('/editUser/validationUsername/:username')
    .get((req, res) => {
        var username = req.params.username;
        var id = req.user._id;
        User.findById(id, (err, userLogged) => {
            User.findOne({
                username: username
            }, (err, user) => {
                console.log("Validate username: " + username);
                if (userLogged.username === username) {
                    return res.status(200).send("Ok")
                }

                if (user !== null) {
                    res.status(409).send('Username already taken');
                } else {
                    res.status(200).send("Ok")
                }
            })
        })
    })

//Route  /api/editUser/validationEmail/:email
//Email validation for editUser
router.route('/editUser/validationEmail/:email')
    .get((req, res) => {
        var email = req.params.email;
        var id = req.user._id;
        User.findById(id, (err, userLogged) => {
            User.findOne({
                email: email
            }, (err, user) => {
                console.log("Validate email: " + email);
                if (userLogged.email === email) {
                    return res.status(200).send("Ok")
                }
                if (user !== null) {
                    res.status(409).send('Email already taken');
                } else {
                    res.status(200).send("Ok")
                }

            })
        })

    })

//Route  /api/editUser/validationPhoneNumber/:phoneNumber
//PhoneNumber validation for edit user
router.route('/editUser/validationPhoneNumber/:phoneNumber')
    .get((req, res) => {
        var phoneNumber = req.params.phoneNumber;
        var id = req.user._id;
        User.findById(id, (err, userLogged) => {
            User.findOne({
                phoneNumber: phoneNumber
            }, (err, user) => {
                console.log("Validate phoneNumber: " + phoneNumber);

                if (userLogged.phoneNumber === phoneNumber) {
                    return res.status(200).send("Ok")
                }

                if (user !== null) {
                    res.status(409).send('phoneNumber already taken');
                } else {
                    res.status(200).send("Ok")
                }
            })
        })

    })

//API Route /api/users
//GET: Getting all users from DB
router.route('/users').get((req, res) => {
    var _id = req.user._id;
    User.findById(_id, (err, userLogged) => {
        var blockeds = [...new Set([...userLogged.blockedUsersByMe, ...userLogged.usersWhoHasBlockedMe])];
        User.find({
                _id: {
                    $ne: _id
                },
                username: {
                    $nin: blockeds
                }
            },
            (err, users) => {
                res.json(users);
                console.log('Getting all but the current user and blockeds');
                res.end();
            }
        );
    })

});

module.exports = router;