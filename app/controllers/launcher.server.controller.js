'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    events = require('events'),
    errorHandler = require('./errors.server.controller'),
    loadTester = require('./loadtester.server.controller'),
    results = require('./results.server.controller'),
    Launch = mongoose.model('Launch'),
    _ = require('lodash');

/**
 * Create a Launch Object
 */
var createLaunch = function(req, res) {
    var launch = new Launch({
        name: req.param('name'),
        server: req.param('server'),
        api: req.param('api'),
        duration: req.param('duration', 10) * 60, // In seconds
        nb_users: req.param('nb_users', 1)
    });
    launch.save(function(err, newLaunch) {
        if (err) {
            console.error(new Error('Unable to create launch: ' + err));
        }
    });
    return launch;
};

/**
 * Run Launcher
 */
exports.run = function(req, res) {
    // Init Launch
    var launch = createLaunch(req, res);
    res.jsonp(launch);
    // Run Load Testers
    var eventEmitter = new events.EventEmitter();
    for (var i = 0; i < launch.nb_users; i++) {
        loadTester.run(i, launch, eventEmitter);
    }
    setTimeout(function() {
        eventEmitter.emit('stopLoadTest');
        eventEmitter.removeAllListeners('stopLoadTest');
        Launch.update({
            start_date: launch.start_date
        }, {
            in_progress: false
        }, function(err, numberAffected, raw) {
            if (err) {
                console.error(new Error('Unable to update launch: ' + err));
            }
        });
        results.create(launch);
    }, launch.duration * 1000);
};

/**
 * List Running Launches
 */
exports.listRunning = function(req, res) {
    Launch.find({
        in_progress: true
    }).sort('-start_date').exec(function(err, results) {
        if (err) {
            return res.status(500).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(results);
        }
    });
};
