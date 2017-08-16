const Coin = require('../models/coin.model.js');
const SocialAccount = require('../models/social.model.js');
const TradeType = require('../models/trade.model.js');
const Wallet = require('../models/wallet.model.js');

module.exports.createSchema = {
  coin: function(data){
    let newCoin = new Coin({
      name: data.name,
      url: data.url,
      price: data.price,
    });
    return newCoin;
  },
  social: function(data){
    let newAcct = new SocialAccount({
      name: data.name,
      url: data.url
    });
    return newAcct;
  },
  trade: function(data){
    let newTradeType = new TradeType({
      orderTypes: data.orderTypes,
      auction: data.auction,
      margin: data.margin,
    });
    return newTradeType;
  },
  wallet: function(data){
    let newWallet = new Wallet({
      address: data.address,
      balance: data.balance,
      coin: data.coin,
      transactions: []
    });
    return newWallet;
  }
}

// for setting new sub-schema to parent schema
module.exports.setSubSchemaData = function setSubSchemaData(body, prop, type){
  for (let i = body.length - 1; i >= 0; i--) {
    prop.push(this.createSchema[type](body[i]));
  }
}
// set exchange sub prop
module.exports.setUpdateSchema = function setUpdateSchema(prop, body){
  for (let i = 0; i < prop.length; i++) {
    for (let j = 0; j < body.length; j++) {
      if(prop[i]._id.toString() === body[j]._id){
        prop.set(i, body[j])
      }
    }
  }
}