const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');



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


module.exports = router;