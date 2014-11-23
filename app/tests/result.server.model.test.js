'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    Launch = mongoose.model('Launch'),
    Result = mongoose.model('Result');

/**
 * Globals
 */
var result;

/**
 * Unit tests
 */
describe('Result Model Unit Tests:', function() {

    beforeEach(function(done) {
        // Create Launch first
        var launch = new Launch({
            name: 'Test launch',
            server: 'test_server',
            api: '/test_api',
            duration: '60',
            nb_users: 2
        });
        // Then create Result on Launch save
        launch.save(function(err, launch) {
            if (err) {
                done(err);
            }
            result = new Result({
                launch: launch,
                nb_hits: 100,
                nb_ko: 0,
                mean_time: 2,
                ninety_percentile: 2.5
            });
            done();
        });
    });

    describe('Method Save', function() {

        it('should be able to save without problems', function(done) {
            return result.save(function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without launch',
            function(done) {
                result.launch = undefined;

                return result.save(function(err) {
                    should.exist(err);
                    done();
                });
            });

        it('should be able to show an error when try to save without nb_hits',
            function(done) {
                result.nb_hits = undefined;

                return result.save(function(err) {
                    should.exist(err);
                    done();
                });
            });
        it('should be able to show an error when try to save a non-number nb_hits',
            function(done) {
                result.nb_hits = 'foo';

                return result.save(function(err) {
                    should.exist(err);
                    done();
                });
            });

        it('should be able to show an error when try to save without nb_ko',
            function(done) {
                result.nb_ko = undefined;

                return result.save(function(err) {
                    should.exist(err);
                    done();
                });
            });
        it('should be able to show an error when try to save a non-number nb_ko',
            function(done) {
                result.nb_ko = 'foo';

                return result.save(function(err) {
                    should.exist(err);
                    done();
                });
            });

        it('should be able to show an error when try to save without mean_time',
            function(done) {
                result.mean_time = undefined;

                return result.save(function(err) {
                    should.exist(err);
                    done();
                });
            });
        it('should be able to show an error when try to save a non-number mean_time',
            function(done) {
                result.mean_time = 'foo';

                return result.save(function(err) {
                    should.exist(err);
                    done();
                });
            });

        it('should be able to show an error when try to save without ninety_percentile',
            function(done) {
                result.ninety_percentile = undefined;

                return result.save(function(err) {
                    should.exist(err);
                    done();
                });
            });
        it(
            'should be able to show an error when try to save a non-number ninety_percentile',
            function(done) {
                result.ninety_percentile = 'foo';

                return result.save(function(err) {
                    should.exist(err);
                    done();
                });
            });
    });

    afterEach(function(done) {
        Result.remove().exec();
        Launch.remove().exec();

        done();
    });
});
