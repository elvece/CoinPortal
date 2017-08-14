const Exchange = require('../models/exchange.model.js').Exchange;
const Coin = require('../models/exchange.model.js').Coin;
const request = require('request-promise');
const Promise = require('bluebird');

// create new exchange data
function create(req, res, next){
  console.log(req.body)
  const exchange = new Exchange({
    name: req.body.name,
    fee: req.body.fee,
    website: req.body.website,
    account: req.body.account,
    twitter: req.body.twitter,
    reddit: req.body.reddit,
    service: req.body.service,
    ux: req.body.ux,
    support: req.body.support,
    verify: req.body.verify,
    margin: req.body.margin,
    auction: req.body.auction,
    orderTypes: req.body.orderTypes,
    purchaseOptions: req.body.purchaseTypes,
    coinsSupported: req.body.coins,
    coinData: req.body.coinData//TODO change this to new coin schema
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
  const exchange = req.exchange;
  exchange.name = req.body.name;
  exchange.fee = req.body.fee;
  exchange.website = req.body.account;
  exchange.account = req.body.account;
  exchange.twitter = req.body.twitter;
  exchange.reddit = req.body.reddit;
  exchange.service = req.body.service;
  exchange.ux = req.body.ux;
  exchange.support = req.body.support;
  exchange.verify = req.body.verify;
  exchange.margin = req.body.margin;
  exchange.auction = req.body.auction;
  // exchange.orderTypes.push(req.body.newOrderType);
  // exchange.purchaseOptions.push(req.body.newPurchaseType);
  // exchange.coinsSupported.push(req.body.newCoin);

  //if no coins yet exist in exchange.coinData
  if(exchange.coinData && exchange.coinData.length <= 0){
    //loop through all new coins in req.body
    req.body.coinData.forEach(function(coin){
      let newCoin = createNewCoin(coin);
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
  console.log(req.body)

  exchange.save()
          .then(updatedExchange => res.json(updatedExchange))
          .catch((e) => {
            console.log(e);
            next(e);
          });
}

function createNewCoin(data){
  let newCoin = new Coin({
    name: data.name,
    url: data.url,
    price: data.price,
  });
  return newCoin;
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
