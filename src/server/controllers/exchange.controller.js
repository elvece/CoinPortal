const Exchange = require('../models/exchange.model.js');

// create new exchange data
function create(req, res, next){
  console.log(req.body)
  const exchange = new Exchange({
    name: req.body.name,
    fee: req.body.fee,
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
    coinsSupported: req.body.coins
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
          .then(exchanges => res.json(exchanges))
          .catch(e => next(e));
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
  exchange.twitter = req.body.twitter;
  exchange.reddit = req.body.reddit;
  exchange.service = req.body.service;
  exchange.ux = req.body.ux;
  exchange.support = req.body.support;
  exchange.verify = req.body.verify;
  exchange.margin = req.body.margin;
  exchange.auction = req.body.auction;
  exchange.orderTypes.push(req.body.newOrderType);
  exchange.purchaseOptions.push(req.body.newPurchaseType);
  exchange.coinsSupported.push(req.body.newCoin);

  exchange.save()
          .then(updatedExchange => res.json(updatedExchange))
          .catch(e => next(e));
}

module.exports = {
  create, get, list, load, remove, update
}
