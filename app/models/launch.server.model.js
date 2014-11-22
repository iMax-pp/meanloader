'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Launch Schema
 */
var LaunchSchema = new Schema({
    server: {
        type: String,
        required: 'A Launch requires a Server'
    },
    api: {
        type: String,
        required: 'A Launch requires an API'
    },
    start_date: {
        type: Date,
        default: Date.now
    },
    duration: {
        type: Number,
        required: 'A Launch requires a Duration'
    },
    nb_users: {
        type: Number,
        required: 'A Launch requires a Number of Users'
    },
    in_progress: {
        type: Boolean,
        default: true
    }
});

var Launch = mongoose.model('Launch', LaunchSchema);
