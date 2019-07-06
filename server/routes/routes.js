const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var async = require('async');
require('dotenv').config();
var enviroment = require('../../src/environments/environmentForNode.ts');

if (!enviroment.production) {
    var serverURL = 'localhost:8100'
} else {
    var serverURL = 'tradheo.herokuapp.com'
}




//Route  /api/turnOnServer
//Turn on the server on heroku
router.route('/turnOnServer')
    .get((req, res) => {
        res.json({
            message: "Awake"
        })
        console.log("Awakening server");
        res.end();

    })

//Route  /api/auth/signup
//Authenticate user based on the data sent by user previously
router.post('/auth/signup', async (req, res, next) => {
    passport.authenticate('signup', async (err, user, info) => {
        try {
            if (err || !user) {
                return next(res.status(500).send(
                    'An Error occured: ' + info['message']
                ));
            } else {
                res.json({
                    message: 'Signup successful',
                    user: user
                });
            }
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
});

//Route  /api/auth/signup/validationUsername/:username
//Username validation for sign up
router.route('/auth/signup/validationUsername/:username')
    .get((req, res) => {
        var username = req.params.username;
        User.findOne({
            username: username
        }, (err, user) => {
            console.log("Validate username: " + username);
            if (user !== null) {
                res.status(409).send('Username already taken');
            } else {
                res.status(200).send("Ok")
            }
        })

    })

//Route  /api/auth/signup/validationEmail/:email
//Email validation for sign up
router.route('/auth/signup/validationEmail/:email')
    .get((req, res) => {
        var email = req.params.email;
        User.findOne({
            email: email
        }, (err, user) => {
            console.log("Validate email: " + email);
            if (user !== null) {
                res.status(409).send('Email already taken');
            } else {
                res.status(200).send("Ok")
            }
        })

    })

//Route  /api/auth/signup/validationEmail/:email
//Email validation for login
router.route('/auth/login/existEmail/:email')
    .get((req, res) => {
        var email = req.params.email;
        User.findOne({
            email: email
        }, (err, user) => {
            console.log("Exist email: " + email);
            if (user !== null) {
                res.status(200).send("Ok")
            } else {
                res.status(404).send('The email does not exist');
            }
        })

    })

//Route  /api/auth/signup/validationPhoneNumber/:phoneNumber
//PhoneNumber validation for sign up
router.route('/auth/signup/validationPhoneNumber/:phoneNumber')
    .get((req, res) => {
        var phoneNumber = req.params.phoneNumber;
        User.findOne({
            phoneNumber: phoneNumber
        }, (err, user) => {
            console.log("Validate phoneNumber: " + phoneNumber);
            if (user !== null) {
                res.status(409).send('phoneNumber already taken');
            } else {
                res.status(200).send("Ok")
            }
        })

    })

//Route /api/auth/login
//Creation of login token for user
router.post('/auth/login', async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {

        try {
            if (err || !user) {
                return next(res.status(500).send(
                    'An Error occured: ' + info['message']
                ));
            }
            const today = new Date();
            if (today > user.licenceDate) {
                console.log("User with licence expired")
                return res.status(403).send('User with licence expired');
            }
            req.login(user, {
                session: false
            }, async (error) => {
                if (error) return next(error)

                //We include in the token the following data: id and username
                const body = {
                    _id: user._id,
                    username: user.username
                };
                //Create the token by signing in JWT
                const token = jwt.sign({
                    user: body
                }, 'v3Ry_DiFfiCuLT_k3Y');
                //Send back the token to the user
                return res.json({
                    token,
                    "message": info['message'],
                });
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
});

//Route /api/auth/forgot
//Token creation to reset password
router.post('/auth/forgot', function (req, res, next) {
    console.log("Trying to reset password");
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            User.findOne({
                email: req.body.email
            }, function (err, user) {


                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function (err) {
                    done(err, token, user);
                });
            });
        },
        function (token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    type: 'OAuth2',
                    user: 'tradheo.app@gmail.com',
                    clientId: '441094021375-e6m683tj61s2f4ut0kgjc8uonadigsjs.apps.googleusercontent.com',
                    clientSecret: process.env.CLIENT_SECRET_GMAIL,
                    refreshToken: process.env.REFRESH_TOKEN_GMAIL,
                    accessToken: process.env.ACCESS_TOKEN_GMAIL
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'tradheo.app@gmail.com',
                subject: 'Tradheo Password Reset',
                text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + serverURL + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                console.log('Sent mail to reset password');
                res.status(200).send();
                done(err, 'done');
            });
        }
    ])
});

router.get('/auth/reset/:token', function (req, res) {
    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    }, function (err, user) {
        if (!user) {
            res.status(500).send('Password reset token is invalid or has expired');
        } else {
            res.status(200).send('Ok');
        }

    });
});

router.post('/auth/reset/:token', function (req, res) {
    async.waterfall([
        function (done) {
            User.findOne({
                resetPasswordToken: req.params.token,
                resetPasswordExpires: {
                    $gt: Date.now()
                }
            }, function (err, user) {
                if (!user) {
                    res.status(500).send('Password reset token is invalid or has expired');
                }

                user.password = req.body.password;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save(function (err) {

                    done(err, user);

                });
            });
        },
        function (user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    type: 'OAuth2',
                    user: 'tradheo.app@gmail.com',
                    clientId: '441094021375-e6m683tj61s2f4ut0kgjc8uonadigsjs.apps.googleusercontent.com',
                    clientSecret: process.env.CLIENT_SECRET_GMAIL,
                    refreshToken: process.env.REFRESH_TOKEN_GMAIL,
                    accessToken: process.env.ACCESS_TOKEN_GMAIL
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'tradheo.app@gmail.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.username + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                res.status(200).send();
                done(err);
            });
        }
    ]);
});





module.exports = router;