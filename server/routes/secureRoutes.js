const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Market = require('../models/marketModel');

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

module.exports = router;

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