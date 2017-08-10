const mongoose = require('mongoose');
const Promise = require('bluebird');

const AccountSchema = new mongoose.Schema({
  id: Schema.Types.ObjectId,
  username: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true
  },
  name: String,
  balances: Schema.Types.Mixed,
  wallets: Schema.Types.Mixed,
  transactions: Schema.Types.Mixed
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
AccountSchema.methods.getBalance = function(coinType){
  return this.balances[coinType];
}

AccountSchema.methods.getWallet = function(coinType){
  return this.wallets[coinType];
}

module.exports = {
  mongoose.model('Accounts', AccountSchema);
};