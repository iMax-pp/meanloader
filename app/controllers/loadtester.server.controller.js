'use strict';

/**
 * Module dependencies.
 */
var proc = require('process'),
    request = require('request'),
    hits = require('./hits.server.controller.js');

var runHit = function (id, launch, eventEmitter) {
    var url = 'http://' + launch.server + launch.api,
        date = Date.now(),
        start = proc.hrtime();
    request(url, function (error, resp) {
        var diff = proc.hrtime(start),
            respTime = (diff[0] * 1e9 + diff[1]) / 1000000.0,
            status = !error && resp.statusCode === 200 ? 'OK' : 'KO';
        eventEmitter.emit('runHit' + id);
        hits.create(launch, date, respTime, status);
    });
};

exports.run = function (id, launch, eventEmitter) {
    eventEmitter.on('runHit' + id, function () {
        runHit(id, launch, eventEmitter);
    });
    eventEmitter.emit('runHit' + id);

    eventEmitter.on('stopLoadTest', function () {
        eventEmitter.removeAllListeners('runHit' + id);
    });
};
