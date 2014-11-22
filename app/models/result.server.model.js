'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Result Schema
 */
var ResultSchema = new Schema({
    launch: {
        type: Schema.Types.ObjectId,
        ref: 'Launch',
        required: 'A Result requires to be linked to a Launch'
    },
    nb_hits: {
        type: Number,
        default: 0,
        required: 'A Result requires a Number of Hits'
    },
    mean_time: {
        type: Number,
        default: 0,
        required: 'A Result requires a Mean Response Time'
    },
    ninety_percentile: {
        type: Number,
        default: 0,
        required: 'A Result requires a 90 percentile Response Time'
    }
});

mongoose.model('Result', ResultSchema);
