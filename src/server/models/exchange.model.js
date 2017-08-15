const mongoose = require('mongoose');
mongoose.set('debug', true)

const Promise = require('bluebird');

const CoinSchema = new mongoose.Schema({
  name: String,
  url: String,
  price: String // String rather than Number so can accept decimal places
});

const TradeSchema = new mongoose.Schema({
  orderTypes: [String],
  auction: Boolean,
  margin: Boolean
});

const SocialSchema = new mongoose.Schema({
  name: String,
  url: String
});

const ExchangeSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    unique: true,
    required: true
  },
  account: Boolean,
  coinData: [CoinSchema], //objects of coin name, api url, and current price
  coinsSupported: [String],
  depositFee: String,
  purchaseOptions: [String],// debit/credit, paypal...
  service: Number,// rating
  social: [SocialSchema],
  support: Number,// rating
  trading: TradeSchema,
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
      .exec();
  }
};

module.exports = {
  Exchange: mongoose.model('Exchanges', ExchangeSchema),
  Coin: mongoose.model('Coins', CoinSchema),
  Trade: mongoose.model('TradeInfo', TradeSchema),
  Social: mongoose.model('SocialInfo', SocialSchema)
};
