const mongoose = require('mongoose');
const Promise = require('bluebird');

const ExchangeSchema = new mongoose.Schema({
  id: Schema.Types.ObjectId,
  name: {
    type: String,
    unique: true,
    required: true
  },
  fee: Number,
  twitter: Schema.Types.Mixed,// will include boolean and url
  reddit: Schema.Types.Mixed,// will include boolean and subredddit url
  service: Number,// rating
  ux: Number,// rating
  support: Number,// rating
  verify: Boolean,
  margin: Boolean,
  orderTypes: [String],
  purchaseOptions: [String],// debit/credit, paypal...
  coinsSupported: [String]
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
  mongoose.model('Exchanges', ExchangeSchema);
};