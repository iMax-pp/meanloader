'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    events = require('events'),
    errorHandler = require('./errors.server.controller'),
    loadTester = require('./loadtester.server.controller'),
    results = require('./results.server.controller'),
    Launch = mongoose.model('Launch');

/**
 * Create a Launch Object and Call Next
 */
var initLaunch = function (req, res, next) {
    var launch = new Launch({
        name: req.param('name'),
        server: req.param('server'),
        api: req.param('api'),
        duration: req.param('duration', 10) * 60, // In seconds (default: 10s)
        interval: req.param('interval', 20), // In milliseconds (default: 20ms)
        nb_users: req.param('nb_users', 1)
    });
    launch.save(function (err) {
        if (err) {
            console.error(new Error('Unable to create launch: ' + err));
            res.status(500).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(launch);
            next(launch);
        }
    });
};

/**
 * Run Launcher
 */
exports.run = function (req, res) {
    // Init Launch
    initLaunch(req, res, function (launch) {
        // Run Load Testers
        var eventEmitter = new events.EventEmitter(),
            i = 0;
        eventEmitter.setMaxListeners(0); // Unlimited event listeners
        for (i; i < launch.nb_users; i += 1) {
            loadTester.run(i, launch, eventEmitter);
        }
        setTimeout(function () {
            eventEmitter.emit('stopLoadTest');
            eventEmitter.removeAllListeners('stopLoadTest');
            Launch.update({
                start_date: launch.start_date
            }, {
                in_progress: false
            }, function (err) {
                if (err) {
                    console.error(new Error('Unable to update launch: ' + err));
                }
            });
            results.create(launch);
        }, launch.duration * 1000);
    });
};

/**
 * List Running Launches
 */
exports.listRunning = function (next) {
    Launch.find({
        in_progress: true
    }).sort('-start_date').exec(function (err, results) {
        if (err) {
            console.log(err);
        } else {
            next(results);
        }
    });
};
