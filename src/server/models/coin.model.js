const mongoose = require('mongoose');

const CoinSchema = new mongoose.Schema({
  name: String,
  url: String,
  price: String, // String rather than Number so can accept decimal places
  minerFee: Number
});

module.exports = mongoose.model('Coins', CoinSchema);
