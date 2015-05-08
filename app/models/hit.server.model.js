'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Hit Schema
 */
var HitSchema = new Schema({
  launch: {
    type: Schema.Types.ObjectId,
    ref: 'Launch',
    required: 'An Hit requires to be linked to a Launch'
  },
  date: {
    type: Date,
    required: 'An Hit requires a Date'
  },
  duration: {
    type: Number,
    required: 'An Hit requires a Response Time'
  },
  status: {
    type: String,
    enum: ['OK', 'KO'],
    required: 'An Hit requires a Status'
  }
});

mongoose.model('Hit', HitSchema);
