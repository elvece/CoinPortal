const Exchange = require('../models/exchange.model.js').Exchange;
const Coin = require('../models/exchange.model.js').Coin;
const Social = require('../models/exchange.model.js').Social;
const Trade = require('../models/exchange.model.js').Trade;
const request = require('request-promise');
const Promise = require('bluebird');

// create new exchange data
function create(req, res, next){
  console.log(req.body)
  const btc = createNewCoinSchema(req.body.btc);
  const twitter = createNewSocialSchema(req.body.twitter);
  const reddit = createNewSocialSchema(req.body.reddit);
  const tradeInfo = createNewTradeSchema(req.body.tradeInfo);

  const exchange = new Exchange({
    name: req.body.name,
    fee: req.body.fee,
    website: req.body.website,
    account: req.body.account,
    twitter: req.body.twitter,//TODO change this to new schema
    reddit: req.body.reddit,//TODO change this to new schema
    service: req.body.service,
    ux: req.body.ux,
    support: req.body.support,
    verify: req.body.verify,
    margin: req.body.margin,//TODO change this to new schema
    auction: req.body.auction,//TODO change this to new schema
    orderTypes: req.body.orderTypes,//TODO change this to new schema
    purchaseOptions: req.body.purchaseTypes,
    coinsSupported: req.body.coins,
    coinData: req.body.coinData//TODO change this to new schema
  });

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
  console.log(req.body)
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
  // exchange.margin = req.body.margin;
  // exchange.auction = req.body.auction;
  // exchange.orderTypes.push(req.body.newOrderType);
  // exchange.purchaseOptions.push(req.body.newPurchaseType);
  // exchange.coinsSupported.push(req.body.newCoin);

  if(req.body.coinData){
    //if no coins yet exist in exchange.coinData
    if(exchange.coinData && exchange.coinData.length <= 0){
      //loop through all new coins in req.body
      req.body.coinData.forEach(function(coin){
        let newCoin = createNewCoinSchema(coin);
        exchange.coinData.push(newCoin);
      })
    }
    //else if coins exist in exchange.coinData, does it match one that exists? if not, create it
    else if(exchange.coinData && exchange.coinData.length > 0){
      //use for loop for better performance, this is more readable imo
      exchange.coinData.forEach(function(coin, i){
        req.body.coinData.forEach(function(bodyCoin, j){
          //coins match on name - updating
          if(coin.name === bodyCoin.name){
            exchange.coinData.set(i, bodyCoin);
          }
        })
      })
    }
  }

  if(req.body.social){
    //if no accounts yet exist in exchange.social
    if(exchange.social && exchange.social.length <= 0){
      //loop through all new accounts in req.body
      req.body.social.forEach(function(acct){
        let newAcct = createNewSocialSchema(acct);
        exchange.social.push(newAcct);
      })
    }
    //else if accounts exist in exchange.social, does it match one that exists? if not, create it
    else if(exchange.social && exchange.social.length > 0){
      //use for loop for better performance, this is more readable imo
      exchange.social.forEach(function(acct, i){
        req.body.social.forEach(function(bodyAcct, j){
          //accts match on name - updating
          if(acct.name === bodyAcct.name){
            exchange.social.set(i, bodyAcct);
          }
        })
      })
    }
  }

  exchange.save()
          .then(updatedExchange => res.json(updatedExchange))
          .catch((e) => {
            console.log(e);
            next(e);
          });
}

function createNewCoinSchema(data){
  let newCoin = new Coin({
    name: data.name,
    url: data.url,
    price: data.price,
  });
  return newCoin;
}

function createNewSocialSchema(data){
  let newAcct = new Social({
    name: data.name,
    url: data.url
  });
  return newAcct;
}

function createNewTradeSchema(data){
  let newTrade = new Trade({
    orderTypes: data.orderTypes,
    auction: data.auction,
    margin: data.margin,
  });
  return newTrade;
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
