'use strict';

var should = require('should'),
    request = require('supertest'),
    app = require('../../server'),
    mongoose = require('mongoose'),
    Result = mongoose.model('Result'),
    agent = request.agent(app);

/**
 * Globals
 */
var credentials, result;

/**
 * Result routes tests
 */
describe('Result CRUD tests', function() {

    it('should be able to save Result instance if logged in', function(done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Save a new Result
                agent.post('/results')
                    .send(result)
                    .expect(200)
                    .end(function(resultSaveErr, resultSaveRes) {
                        // Handle Result save error
                        if (resultSaveErr) done(resultSaveErr);

                        // Get a list of Results
                        agent.get('/results')
                            .end(function(resultsGetErr, resultsGetRes) {
                                // Handle Result save error
                                if (resultsGetErr) done(resultsGetErr);

                                // Get Results list
                                var results = resultsGetRes.body;

                                // Set assertions
                                (results[0].name).should.match('Result Name');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to save Result instance if not logged in', function(done) {
        agent.post('/results')
            .send(result)
            .expect(401)
            .end(function(resultSaveErr, resultSaveRes) {
                // Call the assertion callback
                done(resultSaveErr);
            });
    });

    it('should not be able to save Result instance if no name is provided', function(done) {
        // Invalidate name field
        result.name = '';

        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Save a new Result
                agent.post('/results')
                    .send(result)
                    .expect(400)
                    .end(function(resultSaveErr, resultSaveRes) {
                        // Set message assertion
                        (resultSaveRes.body.message).should.match(
                            'Please fill Result name');

                        // Handle Result save error
                        done(resultSaveErr);
                    });
            });
    });

    it('should be able to update Result instance if signed in', function(done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Save a new Result
                agent.post('/results')
                    .send(result)
                    .expect(200)
                    .end(function(resultSaveErr, resultSaveRes) {
                        // Handle Result save error
                        if (resultSaveErr) done(resultSaveErr);

                        // Update Result name
                        result.name = 'WHY YOU GOTTA BE SO MEAN?';

                        // Update existing Result
                        agent.put('/results/' + resultSaveRes.body._id)
                            .send(result)
                            .expect(200)
                            .end(function(resultUpdateErr, resultUpdateRes) {
                                // Handle Result update error
                                if (resultUpdateErr) done(resultUpdateErr);

                                // Set assertions
                                (resultUpdateRes.body._id).should.equal(
                                    resultSaveRes.body._id);
                                (resultUpdateRes.body.name).should.match(
                                    'WHY YOU GOTTA BE SO MEAN?');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

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
                    // Set assertion
                    res.body.should.be.an.Object.with.property('name', result.name);

                    // Call the assertion callback
                    done();
                });
        });
    });

    it('should be able to delete Result instance if signed in', function(done) {
        agent.post('/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) done(signinErr);

                // Save a new Result
                agent.post('/results')
                    .send(result)
                    .expect(200)
                    .end(function(resultSaveErr, resultSaveRes) {
                        // Handle Result save error
                        if (resultSaveErr) done(resultSaveErr);

                        // Delete existing Result
                        agent.delete('/results/' + resultSaveRes.body._id)
                            .send(result)
                            .expect(200)
                            .end(function(resultDeleteErr, resultDeleteRes) {
                                // Handle Result error error
                                if (resultDeleteErr) done(resultDeleteErr);

                                // Set assertions
                                (resultDeleteRes.body._id).should.equal(
                                    resultSaveRes.body._id);

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
});
