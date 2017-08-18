const Promise = require('bluebird');
const mongoose = require('mongoose');
const Coin = require('../models/coin.model.js');
const SocialAccount = require('../models/social.model.js');
const TradeType = require('../models/trade.model.js');
mongoose.set('debug', true)

const ExchangeSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    unique: true,
    required: true
  },
  accountNeeded: Boolean,
  coinData: [Coin.schema], //objects of coin name, api url, and current price
  coinsSupported: [String],
  depositFee: String,
  purchaseOptions: [String],// debit/credit, paypal...
  service: Number,// rating
  social: [SocialAccount.schema],
  support: Number,// rating
  trading: [TradeType.schema],
  ux: Number,// rating
  verify: Boolean,// identity verification
  website: String,
  withdrawalFee: String
});

ExchangeSchema.statics = {
  get(id){
    return this.findById(id)
      .exec()
      .then((exchange) => {
        if (exchange){
          return exchange;
        }
        return Promise.reject('No exchange found.')
      });
  },
  list(){// returns list of all exchanges
    return this.find()
      .sort({name: 1})
      .exec()
      .then((exchanges) => {
        if(exchanges){
          return exchanges;
        }
        return Promise.reject('Something went wrong loading exchanges.')
      })
  }
};

module.exports = mongoose.model('Exchanges', ExchangeSchema);
