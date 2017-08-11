const express = require('express');
const router = express.Router();
const exchangeCtrl = require('../controllers/exchange.controller');

router.route('/')
  // GET /api/exchanges - gets list of exchanges
  .get(exchangeCtrl.list)
  // POST /api/exchanges - create new exchange
  .post(exchangeCtrl.create);

router.route('/:exchangeId')
  // GET /api/exchanges/:exchangeId - get single exchange
  .get(exchangeCtrl.get)
  // PUT /api/exchanges/:exchangeId - update exchange
  .put(exchangeCtrl.update)
  // DELETE /api/exchanges/:exchangeId - delete exchange
  .delete(exchangeCtrl.remove);

// load exchange when api with exchangeId route parameter is hit
router.param('exchangeId', exchangeCtrl.load)


module.exports = router;