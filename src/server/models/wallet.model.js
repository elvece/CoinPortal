const mongoose = require('mongoose');
const Promise = require('bluebird');

const WalletSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  address: String,
  balance: Number,
  coin: String,
  transactions: []// future feature, will contain TransactionSchema with transaction details/history
});

// statics exist directly on model
WalletSchema.statics = {
  get(id){
    return this.findById(id)
      .exec()
      .then((wallet) => {
        if (wallet){
          return wallet;
        }
        return Promise.reject('No wallet found.')
      });
  },
  list(){// returns all wallets
    return this.find()
      .exec();
  }
};

// methods can be called on any instance of a model
WalletSchema.methods.getBalance = function(coinType){
  return this.balance;
}

WalletSchema.methods.getTransactions = function(coinType){
  return this.transactions;
}

module.exports = mongoose.model('Wallets', WalletSchema);
