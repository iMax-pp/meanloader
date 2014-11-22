'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Hit = mongoose.model('Hit'),
    Result = mongoose.model('Result'),
    _ = require('lodash');

exports.index = function(req, res) {
    res.render('index', {
        request: req
    });
};

/**
 * Create a Result
 */
exports.create = function(launch) {
    Hit.find({
        'launch': launch._id
    }).sort('duration').exec(function(err, hits) {
        if (err) {
            console.error(new Error('Unable to find hits to create result: ' + err));
            return;
        }
        var nbHits = hits.length;
        var totalTime = hits.map(function(hit) {
            return hit.duration;
        }).reduce(function(prev, curr, index, array) {
            return prev + curr;
        });
        var meanTime = totalTime / nbHits;
        var ninetyPercentile = hits[Math.round(nbHits * 90 / 100)].duration;
        console.log(
            'nbHits: ' + nbHits +
            ', hits: ' + hits +
            ', totalTime: ' + totalTime +
            ', meanTime: ' + meanTime +
            ', ninetyPercentile: ' + ninetyPercentile);
        Result.create({
            launch: launch,
            nb_hits: nbHits,
            mean_time: meanTime,
            ninety_percentile: ninetyPercentile
        }, function(err, result) {
            if (err) {
                console.error(new Error('Unable to create result: ' + err));
            }
        });
    });
};

/**
 * Show the current Result
 */
exports.read = function(req, res) {
    res.jsonp(req.result);
};

/**
 * List of Results
 */
exports.list = function(req, res) {
    Result.find().sort('-launch.start_date').populate('launch').exec(function(err, results) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(results);
        }
    });
};

/**
 * Result middleware
 */
exports.resultByID = function(req, res, next, id) {
    Result.findById(id).populate('launch').exec(function(err, result) {
        if (err) return next(err);
        if (!result) return next(new Error('Failed to load Result ' + id));
        req.result = result;
        next();
    });
};
