const mongoose = require('mongoose');

const SocialSchema = new mongoose.Schema({
  name: String,
  url: String
});

module.exports = mongoose.model('SocialAccounts', SocialSchema);
