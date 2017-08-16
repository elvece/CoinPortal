const Exchange = require('../models/exchange.model.js').Exchange;
const Coin = require('../models/exchange.model.js').Coin;
const Social = require('../models/exchange.model.js').Social;
const Trade = require('../models/exchange.model.js').Trade;
const request = require('request-promise');
const Promise = require('bluebird');
const SOCIAL = 'social';
const TRADE = 'trade';
const COIN = 'coin';
const createSchema = {
  coin: function(data){
    let newCoin = new Coin({
      name: data.name,
      url: data.url,
      price: data.price,
    });
    return newCoin;
  },
  social: function(data){
    let newAcct = new Social({
      name: data.name,
      url: data.url
    });
    return newAcct;
  },
  trade: function(data){
    let newTrade = new Trade({
      orderTypes: data.orderTypes,
      auction: data.auction,
      margin: data.margin,
    });
    return newTrade;
  }
}

// for setting new sub-schema to parent schema
function setSubSchemaData(body, prop, type){
  for (let i = body.length - 1; i >= 0; i--) {
    prop.push(createSchema[type](body[i]));
  }
}

function setUpdateSchema(exchangeProp, body){
  for (let i = 0; i < exchangeProp.length; i++) {
    for (let j = 0; j < body.length; j++) {
      if(exchangeProp[i]._id.toString() === body[j]._id){
        exchangeProp.set(i, body[j])
      }
    }
  }
}

// create new exchange data
function create(req, res, next){
  console.log('**********CREATE REQ BODY:',req.body)
  const exchange = new Exchange({
    account: req.body.account,
    depositFee: req.body.depositFee,
    coinData: [],
    coinsSupported: req.body.coins,
    name: req.body.name,
    purchaseOptions: req.body.purchaseTypes,
    service: req.body.service,
    social: [],
    support: req.body.support,
    trading: req.body.trading ? createSchema[TRADE](req.body.trading): null,
    ux: req.body.ux,
    verify: req.body.verify,
    website: req.body.website,
    withdrawalFee: req.body.withdrawalFee
  });

  console.log('********* NEW EXCHANGE:',exchange)

  if(req.body.social){
    setSubSchemaData(req.body.social, exchange.social, SOCIAL);
  }
  if(req.body.coinData){
    setSubSchemaData(req.body.coinData, exchange.coinData, COIN);
  }

  exchange.save()
          .then(savedExchange => res.json(savedExchange))
          .catch(e => next(e))
}

// get one exchange
function get(req, res){
  return res.json(req.exchange);
}

// get all exchanges
function list(req, res, next){
  Exchange.list()
          // .then(exchanges => res.json(exchanges))
          .then((exchanges) => {
            processPriceChange(exchanges).then((exchanges) => {
              res.json(exchanges);
            })
          })
          .catch((e) => {
            console.log(e);
            next(e);
          });
}

// load exchange and append to req
function load(req, res, next, id){
  Exchange.get(id)
    .then((exchange) => {
      req.exchange = exchange;
      return next();
    })
    .catch(e => next(e));
}

// deletes exchange
function remove(req, res, next){
  const exchange = req.exchange;
  exchange.remove()
          .then(deletedExchange => res.json(deletedExchange))
          .catch(e => next(e))

}

// update one exchange
function update(req, res, next){
  console.log('************UPDATE REQ.BODY:',req.body)
  const exchange = req.exchange;
  exchange.name = req.body.name;
  exchange.fee = req.body.fee;
  exchange.website = req.body.website;
  exchange.account = req.body.account;
  exchange.service = req.body.service;
  exchange.ux = req.body.ux;
  exchange.support = req.body.support;
  exchange.verify = req.body.verify;
  // TODO :
  // exchange.purchaseOptions.push(req.body.newPurchaseType);
  // exchange.coinsSupported.push(req.body.newCoin);
  if(req.body.trading){
    //if no trading details yet exist for this exchange
    if((exchange.trading && exchange.trading.length <=0) || !exchange.trading){
      exchange.trading = createSchema[TRADE](req.body.trading);
    }
    else if(exchange.trading && exchange.trading.length > 0){
      // NOTE: need if conditions for each sub prop (ie exchange.trading.margin)?
      exchange.trading.set(exchange.trading.orderTypes, req.body.orderTypes);
      exchange.trading.set(exchange.trading.margin, req.body.margin);
      exchange.trading.set(exchange.trading.auction, req.body.auction);
    }
  }

  if(req.body.coinData){
    //if no coins yet exist in exchange.coinData
    if(exchange.coinData && exchange.coinData.length <= 0){
      setSubSchemaData(req.body.coinData, exchange.coinData, COIN);
    }
    //else if coins exist in exchange.coinData, does it match one that exists? if not, create it
    else if(exchange.coinData && exchange.coinData.length > 0){
      setUpdateSchema(exchange.coinData, req.body.coinData);
    }
  }

  if(req.body.social){
    //if no accounts yet exist in exchange.social
    if(exchange.social && exchange.social.length <= 0){
      setSubSchemaData(req.body.social, exchange.social, SOCIAL)
    }
    //else if accounts exist in exchange.social, does it match one that exists? if not, create it
    else if(exchange.social && exchange.social.length > 0){
      setUpdateSchema(exchange.social, req.body.social);
    }
  }

  exchange.save()
          .then(updatedExchange => res.json(updatedExchange))
          .catch((e) => {
            console.log(e);
            next(e);
          });
}

function getExternalExchangeData(url){
   return request(url)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
      return err;
    })
}

function processPriceChange(exchanges){
  let promises = [];
  exchanges.forEach(function(exchange){
    exchange.coinData.forEach(function(coin){
      promises.push(getExternalExchangeData(coin.url)
        .then((result) => {
          result = JSON.parse(result);
          coin.set({'price': result.last})
          coin.save();
          exchange.save();
        })
        .catch((e) => {
          console.log(e);
          next(e);
        })
    )});
  });
  // ensure all exchanges have processed updates before resolving
  return Promise.all(promises)
    .then(() => {
      // need to return a promise for proper handling in route method
      return new Promise((resolve) => {
        return resolve(exchanges);
      });
    }).catch((e) => {
        console.log(e)
    });
}

function updatePriceData(data, id){
  Exchange.get(id)
    .then((exchange) => {
      exchange.coinData = data
    })
}

module.exports = {
  create, get, list, load, remove, update, processPriceChange
}
