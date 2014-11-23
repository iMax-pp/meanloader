'use strict';

var should = require('should'),
    request = require('supertest'),
    app = require('../../server'),
    mongoose = require('mongoose'),
    Launch = mongoose.model('Launch'),
    Result = mongoose.model('Result'),
    agent = request.agent(app);

/**
 * Globals
 */
var result;

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

/**
 * Result routes tests
 */
describe('Result CRUD tests', function() {

    it('should be able to get a list of Results if not signed in', function(done) {
        // Create new Result model instance
        var resultObj = new Result(result);

        // Save the Result
        resultObj.save(function() {
            // Request Results
            request(app).get('/results')
                .end(function(req, res) {
                    // Set assertion
                    res.body.should.be.an.Array.with.lengthOf(1);

                    // Call the assertion callback
                    done();
                });

        });
    });

    it('should be able to get a single Result if not signed in', function(done) {
        // Create new Result model instance
        var resultObj = new Result(result);

        // Save the Result
        resultObj.save(function() {
            request(app).get('/results/' + resultObj._id)
                .end(function(req, res) {
                    // Set assertions
                    res.body.should.be.an.Object.with.property('nb_hits', result.nb_hits);
                    res.body.should.be.an.Object.with.property('nb_ko', result.nb_ko);
                    res.body.should.be.an.Object.with.property('mean_time', result.mean_time);
                    res.body.should.be.an.Object.with.property(
                        'ninety_percentile', result.ninety_percentile);

                    // Call the assertion callback
                    done();
                });
        });
    });
});

afterEach(function(done) {
    Result.remove().exec();
    done();
});
