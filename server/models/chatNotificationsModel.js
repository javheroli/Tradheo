const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const chatNotificationsModel = new Schema({
  username: {
    type: String,
    required: true
  },
  notifications: {
    type: Map,
    of: Number,
    required: true
  }



});
module.exports = mongoose.model('chatNotifications', chatNotificationsModel);