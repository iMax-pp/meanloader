'use strict';

module.exports = function (app) {
    var hits = require('../../app/controllers/hits.server.controller');

    app.route('/hits/:launchid').get(hits.list);
};
