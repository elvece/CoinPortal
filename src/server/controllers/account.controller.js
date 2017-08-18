const Promise = require('bluebird');
const request = require('request-promise');
const Account = require('../models/account.model.js');
const Helper = require('../helpers/schema.helpers.js');
const WALLET = 'wallet';

// create new account data
function create(req, res, next){
  console.log('**********CREATE REQ BODY:', req.body)
  const account = new Account({
    username: req.body.username,
    name: req.body.name,
    wallets: []
  });

  console.log('********* NEW account:', account)

  if(req.body.wallets){
    Helper.setSubSchemaData(req.body.wallets, account.wallets, WALLET);
  }

  account.save()
          .then(savedAccount => res.json(savedAccount))
          .catch(e => next(e))
}

// get one account
function get(req, res){
  return res.json(req.account);
}

// get all accounts
function list(req, res, next){
  Account.list()
          // .then(accounts => res.json(accounts))
          .then((accounts) => {
            res.json(accounts);
          })
          .catch((e) => {
            console.log(e);
            next(e);
          });
}

// load account and append to req
function load(req, res, next, id){
  Account.get(id)
    .then((account) => {
      req.account = account;
      return next();
    })
    .catch(e => next(e));
}

// deletes account
function remove(req, res, next){
  const account = req.account;
  account.remove()
          .then(deletedAccount => res.json(deletedAccount))
          .catch(e => next(e))

}

// update one account
function update(req, res, next){
  console.log('************UPDATE REQ.BODY:',req.body)
  const account = req.account;
  account.username = req.body.username;
  account.name = req.body.name;


  if(req.body.wallets){
    //if no wallets yet exist in account.wallets
    if(account.wallets && account.wallets.length <= 0){
      Helper.setSubSchemaData(req.body.wallets, account.wallets, WALLET);
    }
    else if(account.wallets && account.wallets.length > 0){
      Helper.setUpdateSchema(account.wallets, req.body.wallets);
    }
  }

  account.save()
          .then(updatedAccount => res.json(updatedAccount))
          .catch((e) => {
            console.log(e);
            next(e);
          });
}


module.exports = {
  create, get, list, load, remove, update
}
