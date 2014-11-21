'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    Result = mongoose.model('Result');

/**
 * Globals
 */
var result;

/**
 * Unit tests
 */
describe('Result Model Unit Tests:', function() {

    describe('Method Save', function() {
        it('should be able to save without problems', function(done) {
            return result.save(function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without name', function(done) {
            result.name = '';

            return result.save(function(err) {
                should.exist(err);
                done();
            });
        });
    });

    afterEach(function(done) {
        Result.remove().exec();

        done();
    });
});
