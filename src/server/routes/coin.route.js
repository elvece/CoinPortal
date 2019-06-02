const express = require('express');
const router = express.Router();
const request = require('request-promise');

// GET /api/coins/prices - gets list of all coin prices (and other trend data)
router.get('/prices', function(req, res, next) {
  const options = {
    uri: 'https://api.coinmarketcap.com/v1/ticker/',
    json: true
  };
  request(options)
    .then(function(result){
      res.send(result);
    })
    .catch(function(e){
      next(e);
    });
});
// GET /api/coins/prices/:coin - gets coin price and trend data
router.get('/price/:coin', function(req, res, next) {
  const options = {
    uri: 'https://api.coinmarketcap.com/v1/ticker/'+req.params.coin,
    json: true
  };
  request(options)
    .then(function(result){
      res.send(result);
    })
    .catch(function(e){
      next(e);
    });
});
// GET /api/coins/icons - gets icon information for all coins
router.get('/icons', function(req, res, next) {
  const options = {
    uri: 'https://shapeshift.io/getcoins/',
    json: true
  };
  request(options)
    .then(function(result){
      res.send(result);
    })
    .catch(function(e){
      next(e);
    });
});


module.exports = router;