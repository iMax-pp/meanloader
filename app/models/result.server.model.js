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
        required: 'A Result requires a Number of Hits'
    },
    nb_ko: {
        type: Number,
        required: 'A Result requires a Number of KO'
    },
    mean_time: {
        type: Number,
        required: 'A Result requires a Mean Response Time'
    },
    ninety_percentile: {
        type: Number,
        required: 'A Result requires a 90 percentile Response Time'
    }
});

mongoose.model('Result', ResultSchema);
