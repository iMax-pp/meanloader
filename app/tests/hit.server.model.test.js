'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    Launch = mongoose.model('Launch'),
    Hit = mongoose.model('Hit');

/**
 * Globals
 */
var hit;

/**
 * Unit tests
 */
describe('Hit Model Unit Tests:', function() {

    beforeEach(function(done) {
        // Create Launch first
        var launch = new Launch({
            name: 'Test launch',
            server: 'test_server',
            api: '/test_api',
            duration: '60',
            nb_users: 2
        });
        // Then create Hit on Launch save
        launch.save(function(err, launch) {
            if (err) {
                done(err);
            }
            hit = new Hit({
                launch: launch,
                date: Date.now(),
                duration: 2,
                status: 'OK'
            });
            done();
        });
    });

    describe('Method Save', function() {

        it('should be able to save without problems', function(done) {
            return hit.save(function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without launch',
            function(done) {
                hit.launch = undefined;

                return hit.save(function(err) {
                    should.exist(err);
                    done();
                });
            });

        it('should be able to show an error when try to save without date',
            function(done) {
                hit.date = undefined;

                return hit.save(function(err) {
                    should.exist(err);
                    done();
                });
            });
        it('should be able to show an error when try to save a non-date date',
            function(done) {
                hit.date = 'foo';

                return hit.save(function(err) {
                    should.exist(err);
                    done();
                });
            });

        it('should be able to show an error when try to save without duration',
            function(done) {
                hit.duration = undefined;

                return hit.save(function(err) {
                    should.exist(err);
                    done();
                });
            });
        it('should be able to show an error when try to save a non-number duration',
            function(done) {
                hit.duration = 'foo';

                return hit.save(function(err) {
                    should.exist(err);
                    done();
                });
            });

        it('should be able to show an error when try to save without status',
            function(done) {
                hit.status = undefined;

                return hit.save(function(err) {
                    should.exist(err);
                    done();
                });
            });
        it('should be able to show an error when try to save a status other than OK/KO',
            function(done) {
                hit.status = 'foo';

                return hit.save(function(err) {
                    should.exist(err);
                    done();
                });
            });
    });

    afterEach(function(done) {
        Hit.remove().exec();
        Launch.remove().exec();

        done();
    });
});
