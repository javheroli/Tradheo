const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../models/userModel');

//User registration middleware
passport.use('signup', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    try {
        //Find if the username already exists in the DB
        const user = await UserModel.findOne({
            username
        });

        if (!user) {
            var email = req.body.email
            var phoneNumber = req.body.phoneNumber
            var birthDate = req.body.birthDate
            var firstName = req.body.firstName
            var lastName = req.body.lastName
            var description = req.body.description
            var country = req.body.country
            var city = req.body.city
            var admin = false
            var isDeleted = false
            var blockedUsersByMe = []
            var usersWhoHasBlockedMe = []

            if (req.file !== undefined) {
                image = req.file.url

                //Save the information provided by the user to the DB
                const user = await UserModel.create({
                    username,
                    password,
                    email,
                    phoneNumber,
                    birthDate,
                    firstName,
                    lastName,
                    description,
                    country,
                    city,
                    admin,
                    isDeleted,
                    image,
                    blockedUsersByMe,
                    usersWhoHasBlockedMe
                });
                //Send the user information to the next middleware
                return done(null, user);
            } else {
                //Save the information provided by the user to the DB
                const user = await UserModel.create({
                    username,
                    password,
                    email,
                    phoneNumber,
                    birthDate,
                    firstName,
                    lastName,
                    description,
                    country,
                    city,
                    admin,
                    isDeleted,
                    blockedUsersByMe,
                    usersWhoHasBlockedMe
                });
                //Send the user information to the next middleware
                return done(null, user);
            }

        } else {
            return done(null, false, {
                message: 'Username already exists'
            });
        }

    } catch (error) {
        done(error);
    }
}));

//User login middleware
passport.use('login', new localStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, async (username, password, done) => {
    try {
        //Find the user with the username provided
        const user = await UserModel.findOne({
            username
        });
        //User doesn't exist
        if (!user) {
            return done(null, false, {
                message: 'User not found'
            });
        }
        //Verify if the password's hash matches with the one stored in DB
        const validate = await user.isValidPassword(password);
        if (!validate) {
            return done(null, false, {
                message: 'Wrong Password'
            });
        }
        //Send the user information to the next middleware
        return done(null, user, {
            message: 'Logged in Successfully'
        });
    } catch (error) {
        return done(error);
    }
}));


const JWTstrategy = require('passport-jwt').Strategy;
//We use this to extract the JWT sent by the user
const ExtractJWT = require('passport-jwt').ExtractJwt;

//Verify if token send by user is valid
passport.use(new JWTstrategy({
    //secret we used to sign our JWT
    secretOrKey: 'v3Ry_DiFfiCuLT_k3Y',
    //we expect the user to send the token as a query paramater with the name 'secret_token'
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
}, async (token, done) => {
    try {
        //Pass the user details to the next middleware
        return done(null, token.user);
    } catch (error) {
        done(error);
    }
}));