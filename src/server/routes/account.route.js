const express = require('express');
const router = express.Router();
const accountCtrl = require('../controllers/account.controller');

router.route('/')
  // GET /api/accounts - gets list of accounts
  .get(accountCtrl.list)
  // POST /api/accounts - create new account
  .post(accountCtrl.create);

router.route('/:accountId')
  // GET /api/accounts/:accountId - get single account
  .get(accountCtrl.get)
  // PUT /api/accounts/:accountId - update account
  .put(accountCtrl.update)
  // DELETE /api/accounts/:accountId - delete account
  .delete(accountCtrl.remove);

// load account when api with accountId route parameter is hit
router.param('accountId', accountCtrl.load)


module.exports = router;