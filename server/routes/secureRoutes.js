const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const auth = require('../auth/auth');

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