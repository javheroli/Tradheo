const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const messageModel = new Schema({
  sender: {
    type: String,
    required: true
  },
  receiver: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now()
  },
  message: {
    type: String,
    required: true
  },
  edited: {
    type: Date,
    default: null
  }

});
module.exports = mongoose.model('message', messageModel);