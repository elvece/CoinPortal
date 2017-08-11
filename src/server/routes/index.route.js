const express = require('express');
const router = express.Router();
const exchangeRoutes = require('./exchange.routes');

// GET /sanity-check - checks service working
router.get('/sanity-check', function (req, res, next) {
  res.json('hello world');
});

// mount exchange routes at /api/exchanges
router.use('/api/exchanges', exchangeRoutes);

module.exports = router;