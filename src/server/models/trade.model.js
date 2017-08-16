const mongoose = require('mongoose');

const TradeSchema = new mongoose.Schema({
  orderTypes: [String],
  auction: Boolean,
  margin: Boolean
});

module.exports = mongoose.model('TradeTypes', TradeSchema);
