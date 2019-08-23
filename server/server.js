const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
var bodyParser = require('body-parser');
var multer = require('multer');
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const passport = require('passport');
var routes = require('./routes/routes.js');
var secureRoutes = require('./routes/secureRoutes.js');
require('./auth/auth');
const axios = require('axios');

//Connection to DataBase:
//To connect to Development environment DB (Comment line below if not using it)
/*mongoose.connect('mongodb://localhost:27017/Tradheo', {
  useNewUrlParser: true
});*/

//To connect to DB in cloud:
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true
});

mongoose.connection.on('error', error => console.log(error));
mongoose.Promise = global.Promise;

mongoose.set('useFindAndModify', false);
const app = express();

//For parsing body with Content-Type application/json
app.use(bodyParser.json());
//For parsing body with Content-Type application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));
//For parsing multipart/form-data
//Parser to upload an image to Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "userImages",
  allowedFormats: ["jpg", "png", "jpeg", "gif"],
  transformation: [{
    width: 500,
    height: 500,
    crop: "limit"
  }]
});
const parser = multer({
  storage: storage
});
app.use(parser.single('image'));

//Allowing Cross-Origin Request
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS, PUT, DELETE');
  //intercepts OPTIONS method
  if ('OPTIONS' === req.method) {
    //respond with 200
    res.sendStatus(200);
  } else {
    //move on
    next();
  }
});


const captchaCheck = (req, res, next) => {

  console.log("CAPTCHA middleware activated");

  let urlEncodedData = 'secret=' + process.env.CAPTCHA_KEY + '&response=' + req.body.captchaResponse + '&remoteip=' + req.connection.remoteAddress;

  axios.post('https://www.google.com/recaptcha/api/siteverify', urlEncodedData, {

    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }

  }).then((res) => {

    if (res.data.success) {
      next();
    } else {
      res.status(401).send({
        message: 'No bots!'
      });
    }

  }).catch((err) => {
    console.log(err);
    res.status(401).send({
      message: 'No bots!'
    });
  });

}

app.post('/api/captchaVerify', captchaCheck, (req, res) => {
  res.json('Hello, human.');
});

//Server path to annonymous users routes
app.use('/api', routes);

//Access to API contract
app.use("/api/docs", express.static('docs'));

//Server path to logged users secured routes
app.use('/api', passport.authenticate('jwt', {
  session: false
}), secureRoutes);


const port = process.env.PORT || 5000;
app.listen(port);

console.log(`API listening on ${port}`);


module.exports = app;