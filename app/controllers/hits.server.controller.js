'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Hit = mongoose.model('Hit'),
    _ = require('lodash');

/**
 * Create a Hit
 */
exports.create = function(launch, date, respTime, status) {
    Hit.create({
        launch: launch,
        date: date,
        duration: respTime,
        status: status
    }, function(err, hit) {
        if (err) {
            console.error(new Error('Unable to create hit: ' + err));
        }
    });
};

/**
 * List of Hits
 */
exports.list = function(req, res) {
    Hit.find({
        'launch': req.param('launchid')
    }).sort('-date').exec(function(err, results) {
        if (err) {
            return res.status(500).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(results);
        }
    });
};
