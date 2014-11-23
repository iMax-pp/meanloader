'use strict';

/**
 * Module dependencies.
 */
var process = require('process'),
    request = require('request'),
    hits = require('./hits.server.controller.js'),
    _ = require('lodash');

var runHit = function(id, launch, eventEmitter) {
    var url = 'http://' + launch.server + launch.api;
    var date = Date.now();
    var start = process.hrtime();
    request(url, function(error, resp, body) {
        var diff = process.hrtime(start);
        var respTime = (diff[0] * 1e9 + diff[1]) / 1000000.0;
        var status = error === undefined ? 'KO' : 'OK';
        hits.create(launch, date, respTime, status);
        eventEmitter.emit('runHit' + id);
    });
};

exports.run = function(id, launch, eventEmitter) {
    eventEmitter.on('runHit' + id, function() {
        runHit(id, launch, eventEmitter);
    });
    eventEmitter.emit('runHit' + id);

    eventEmitter.on('stopLoadTest', function() {
        eventEmitter.removeAllListeners('runHit' + id);
    });
};
