const Exchange = require('../models/exchange.model.js');

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
