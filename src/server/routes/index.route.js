const express = require('express');
const router = express.Router();
const exchangeRoutes = require('./exchange.route');
const accountRoutes = require('./account.route');

// GET /sanity-check - checks service working
router.get('/sanity-check', function (req, res, next) {
  res.json('hello world');
});

// mount exchange routes at /api/exchanges
router.use('/api/exchanges', exchangeRoutes);
// mount account routes at /api/accounts
router.use('/api/accounts', accountRoutes);

module.exports = router;