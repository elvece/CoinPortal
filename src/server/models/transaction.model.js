const mongoose = require('mongoose');
const Promise = require('bluebird');

const TransactionSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  txid: String,
  vout: Number,
  address: String,
  scriptPubKey: String,
  amount: Number,
  confirmations: Number,
  spendable: Boolean,
  solvable: Boolean
});

// statics exist directly on model
TransactionSchema.statics = {
  get(id){
    return this.findById(id)
      .exec()
      .then((tx) => {
        if (tx){
          return tx;
        }
        return Promise.reject('No transaction found.')
      });
  },
  list(){// returns all transactions
    return this.find()
      .exec();
  }
};

module.exports = mongoose.model('Transactions', TransactionSchema);
