(function(appConfig) {

  'use strict';

  // *** main dependencies *** //
  const path = require('path');
  const cookieParser = require('cookie-parser');
  const bodyParser = require('body-parser');
  const flash = require('connect-flash');
  const morgan = require('morgan');

  // *** load environment variables *** //
  // require('dotenv').config();

  appConfig.init = function(app, express) {

    // *** app middleware *** //
    if (process.env.NODE_ENV !== 'test') {
      app.use(morgan('dev'));
    }
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(flash());

    if(process.env.NODE_ENV !== 'production'){
      app.use(express.static(path.join(__dirname, '..', '..', 'client')));
    } else {
      // Serve static files from the React app
      app.use(express.static(path.resolve(__dirname, '..', '..','client/build/')));
      //catch-all to fall back on react build root
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname,'..', '..', 'client/build/'));
      })
    }
  };

})(module.exports);
