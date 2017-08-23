const mongoose = require('mongoose');

const RateSchema = new mongoose.Schema({
  txId: String,
  rate: Number,
  amount: Number
});

module.exports = mongoose.model('Rates', RateSchema);
