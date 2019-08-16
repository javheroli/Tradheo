const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const adminSettingsModel = new Schema({

  company: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
});
module.exports = mongoose.model('adminSettings', adminSettingsModel);