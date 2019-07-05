const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
var crypto = require('crypto');
var nodemailer = require('nodemailer');




//Route  /api/turnOnServer
//Turn on de server on heroku
router.route('/turnOnServer')
    .get((req, res) => {
        res.json({
            message: "Awake"
        })
        console.log("Awakening server");
        res.end();

    })

//Route  /api/auth/signup
//Authenticate user based on the data sended by user previously
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
//Turn on de server on heroku
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
//Turn on de server on heroku
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
//Turn on de server on heroku
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
//Turn on de server on heroku
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

router.post('/auth/forgot', function (req, res, next) {
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
            var smtpTransport = nodemailer.createTransport('SMTP', {
                service: 'Gmail',
                auth: {
                    user: 'tradheo.app@gmail.com',
                    pass: process.env.EMAIL_PASSWORD
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'tradheo.app@gmail.com',
                subject: 'Tradheo Password Reset',
                text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/api/auth/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
        }
    ])
});






module.exports = router;