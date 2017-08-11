(function (routeConfig) {

  'use strict';

  routeConfig.init = function (app) {

    // *** routes *** //
    const routes = require('../routes/index.route');

    // *** register routes *** //
    app.use('/', routes);

  };

})(module.exports);
