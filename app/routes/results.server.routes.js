'use strict';

module.exports = function(app) {
    var results = require('../../app/controllers/results.server.controller');

    app.route('/').get(results.index);

    // Results Routes
    app.route('/results').get(results.list);

    app.route('/results/:resultId').get(results.read);

    // Finish by binding the Result middleware
    app.param('resultId', results.resultByID);
};
