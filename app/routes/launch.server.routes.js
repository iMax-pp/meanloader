'use strict';

module.exports = function(app) {
    var launcher = require('../../app/controllers/launcher.server.controller');

    app.route('/launches').get(launcher.listRunning);

    app.route('/launch').get(launcher.run);
};
