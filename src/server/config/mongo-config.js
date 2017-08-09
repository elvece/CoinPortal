(function (mongoConfig) {

  'use strict';

    const mongoose = require('mongoose');
    const mongoDBS = {
      test: 'mongodb://localhost/coin-portal-test',
      development: 'mongodb://localhost/coin-portal',
      production: process.env.MONGOLAB_URI
    };
    const config = {
      MONGO_URI: mongoDBS
    };

    mongoConfig.init = function(app) {
      // ES6 promises
      mongoose.Promise = global.Promise;

      // mongodb connection
      mongoose.connect(config.MONGO_URI[app.settings.env], {
        useMongoClient: true,
        promiseLibrary: global.Promise
      });

      // mongodb error
      mongoose.connection.on('error', console.error.bind(console, 'Mongod Connection Error:'));

      // mongodb connection open
      mongoose.connection.once('open', () => {
        console.log(`Connected to Mongo: ${config.MONGO_URI[app.settings.env]} at: ${new Date()}`)
      });
    }

})(module.exports);
