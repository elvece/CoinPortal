const Coin = require('../models/coin.model.js');
const SocialAccount = require('../models/social.model.js');
const TradeType = require('../models/trade.model.js');

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
  }
}

// for setting new sub-schema to parent schema
module.exports.setSubSchemaData = function setSubSchemaData(body, prop, type){
  for (let i = body.length - 1; i >= 0; i--) {
    prop.push(this.createSchema[type](body[i]));
  }
}
// set exchange sub prop
module.exports.setUpdateSchema = function setUpdateSchema(exchangeProp, body){
  for (let i = 0; i < exchangeProp.length; i++) {
    for (let j = 0; j < body.length; j++) {
      if(exchangeProp[i]._id.toString() === body[j]._id){
        exchangeProp.set(i, body[j])
      }
    }
  }
}