const mongoose = require('mongoose');
mongoose.set('debug', true)

const Promise = require('bluebird');

const CoinSchema = new mongoose.Schema({
  name: String,
  url: String,
  price: Number
});

const ExchangeSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    unique: true,
    required: true
  },
  fee: Number,
  website: String,
  account: Boolean,
  twitter: mongoose.Schema.Types.Mixed,// will include boolean and url
  reddit: mongoose.Schema.Types.Mixed,// will include boolean and subredddit url
  service: Number,// rating
  ux: Number,// rating
  support: Number,// rating
  verify: Boolean,// identity verification
  margin: Boolean,
  auction: Boolean,
  orderTypes: [String],
  purchaseOptions: [String],// debit/credit, paypal...
  coinsSupported: [String],
  coinData: [CoinSchema] //objects of coin name, api url, and current price
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
  Coin: mongoose.model('Coins', CoinSchema)
};
