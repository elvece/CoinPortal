(function (routeConfig) {

  'use strict';

  const path = require('path');

  routeConfig.init = function (app) {

    // *** routes *** //
    const routes = require('../routes/index.route');

    // *** register routes *** //
    app.use('/', routes);

    //catch-all to fall back on react build root
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '..', '..', 'client/build/index.html'));
    })
  };

})(module.exports);
