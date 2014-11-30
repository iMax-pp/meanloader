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
        var nbKO = hits.filter(function(hit) {
            return hit.status === 'KO';
        }).length;
        var totalTime = hits.map(function(hit) {
            return hit.duration;
        }).reduce(function(prev, curr, index, array) {
            return prev + curr;
        });
        var meanTime = totalTime / nbHits;
        var ninetyPercentile = hits[Math.round(nbHits * 90 / 100)].duration;
        Result.create({
            launch: launch,
            nb_hits: nbHits,
            nb_ko: nbKO,
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
 * Return the current Result with detailed stats
 */
exports.read = function(req, res) {
    Hit.aggregate([{
        $match: {
            launch: req.result.launch._id
        }
    }, {
        $group: {
            _id: {
                hour: {
                    $hour: '$date'
                },
                minute: {
                    $minute: '$date'
                },
                second: {
                    $second: '$date'
                }
            },
            meanTime: {
                $avg: '$duration'
            },
            nbOK: {
                $sum: {
                    $cond: [{
                            $eq: ['$status', 'OK']
                        },
                        1, 0
                    ]
                }
            },
            nbKO: {
                $sum: {
                    $cond: [{
                            $eq: ['$status', 'KO']
                        },
                        1, 0
                    ]
                }
            }
        }
    }, {
        $sort: {
            _id: 1
        }
    }], function(err, stats) {
        if (err) {
            console.error(new Error('Unable to find hits of given result: ' + err));
            return;
        }
        res.jsonp({
            result: req.result,
            stats: stats
        });
    });
};

/**
 * List of Results
 */
exports.list = function(req, res) {
    Result.find().populate('launch').sort('-launch').exec(function(err, results) {
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
