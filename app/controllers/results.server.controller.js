'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
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
exports.create = function(req, res) {
    var result = new Result(req.body);

    result.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(result);
        }
    });
};

/**
 * Show the current Result
 */
exports.read = function(req, res) {
    res.jsonp(req.result);
};

/**
 * Update a Result
 */
exports.update = function(req, res) {
    var result = req.result;

    result = _.extend(result, req.body);

    result.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(result);
        }
    });
};

/**
 * Delete an Result
 */
exports.delete = function(req, res) {
    var result = req.result;

    result.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(result);
        }
    });
};

/**
 * List of Results
 */
exports.list = function(req, res) {
    Result.find().sort('-created').populate('displayName').exec(function(err, results) {
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
    Result.findById(id).populate('displayName').exec(function(err, result) {
        if (err) return next(err);
        if (!result) return next(new Error('Failed to load Result ' + id));
        req.result = result;
        next();
    });
};
