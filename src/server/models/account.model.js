const mongoose = require('mongoose');
const Wallet = require('../models/wallet.model.js');
const Promise = require('bluebird');

const AccountSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  username: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  wallets: [Wallet.schema],
});

// statics exist directly on model
AccountSchema.statics = {
  get(id){
    return this.findById(id)
      .exec()
      .then((account) => {
        if (account){
          return account;
        }
        return Promise.reject('No account found.')
      });
  },
  list(){// returns all accounts
    return this.find()
      .sort({name: 1})
      .exec();
  }
};

// methods can be called on any instance of a model
AccountSchema.methods.getWallet = function(coin){
  return Wallet.findOne({coin: coin})
    .populate()
    .exec();
}

module.exports = mongoose.model('Accounts', AccountSchema);