const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const simulatorModel = new Schema({
  username: {
    type: String
  },
  company: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    require: true
  },
  purchaseDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  purchaseValue: {
    type: Number,
    required: true
  },
  saleDate: {
    type: Date
  },
  saleValue: {
    type: Number
  },
  result: {
    type: Number
  },
  lossClosure: {
    type: Number,
  }





});
module.exports = mongoose.model('simulator', simulatorModel);