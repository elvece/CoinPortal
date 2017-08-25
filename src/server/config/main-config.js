(function(appConfig) {

  'use strict';

  // *** main dependencies *** //
  const path = require('path');
  const cookieParser = require('cookie-parser');
  const bodyParser = require('body-parser');
  const session = require('express-session');
  const flash = require('connect-flash');
  const morgan = require('morgan');
  const nunjucks = require('nunjucks');

  // *** view folders *** //
  // const viewFolders = [
  //   path.join(__dirname, '..', 'views')
  // ];

  // *** load environment variables *** //
  require('dotenv').config();

  appConfig.init = function(app, express) {

    // *** view engine *** //
    // nunjucks.configure(viewFolders, {
    //   express: app,
    //   autoescape: true
    // });
    // app.set('view engine', 'html');

    // *** app middleware *** //
    if (process.env.NODE_ENV !== 'test') {
      app.use(morgan('dev'));
    }
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    // // uncomment if using express-session
    // app.use(session({
    //   secret: process.env.SECRET_KEY,
    //   resave: false,
    //   saveUninitialized: true
    // }));
    app.use(flash());
    // app.use(express.static(path.join(__dirname, '..', '..', 'client')));

    // Serve static files from the React app
    app.use(express.static(path.join(__dirname, '..', '..','client/build')));
    //catch-all to fall back on react build root
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '..', '..','/client/build/index.html'));
    })

  };

})(module.exports);
