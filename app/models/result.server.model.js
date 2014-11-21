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
    name: {
        type: String,
        default: '',
        required: 'Please fill Result name',
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Result', ResultSchema);
