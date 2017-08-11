const Exchange = require('../models/exchange.model.js');

// load user and append to req
function load(req, res, next, id){
  Exchange.get(id)
    .then((exchange) => {
      req.exchange = exchange;
      return next();
    })
    .catch(e => next(e));
}

// get one exchange
function get(req, res){
  return res.json(req.exchange);
}

// create new exchange data
function create(){
  const exchange = new Exchange({
    name = req.body.name;
    fee = req.body.fee;
    twitter.account = req.body.twitter.account;
    twitter.url = req.body.twitter.url;
    twitter.reddit.account = req.body.reddit.account;
    twitter.reddit.url = req.body.reddit.url;
    service = req.body.service;
    ux = req.body.ux;
    support = req.body.support;
    verify = req.body.verify;
    margin = req.body.margin;
    auction = req.body.auction;
    orderTypes.push(req.body.newOrderType);
    purchaseOptions.push(req.body.newPurchaseType);
    coinSupported.push(req.body.newCoin);
  });

  exchange.save()
          .then(savedExchange => res.json(savedExchange))
          .catch(e => next(e))
}

// get all exchanges
function list(req, res, next){
  Exchange.list()
          .then(exchanges => res.json(exchanges))
          .catch(e => next(e));
}

// update one exchange
function update(req, res, next){
  const exchange = req.exchange;
  exchange.name = req.body.name;
  exchange.fee = req.body.fee;
  exchange.twitter.account = req.body.twitter.account;
  exchange.twitter.url = req.body.twitter.url;
  exchange.twitter.reddit.account = req.body.reddit.account;
  exchange.twitter.reddit.url = req.body.reddit.url;
  exchange.service = req.body.service;
  exchange.ux = req.body.ux;
  exchange.support = req.body.support;
  exchange.verify = req.body.verify;
  exchange.margin = req.body.margin;
  exchange.auction = req.body.auction;
  exchange.orderTypes.push(req.body.newOrderType);
  exchange.purchaseOptions.push(req.body.newPurchaseType);
  exchange.coinSupported.push(req.body.newCoin);

  exchange.save()
          .then(updatedExchange => res.json(updatedExchange))
          .catch(e => next(e));
}
