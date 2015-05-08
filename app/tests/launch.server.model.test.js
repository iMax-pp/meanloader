'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  Launch = mongoose.model('Launch');

/**
 * Globals
 */
var launch;

/**
 * Unit tests
 */
describe('Launch Model Unit Tests:', function() {

  beforeEach(function() {
    launch = new Launch({
      name: 'Test launch',
      server: 'test_server',
      api: '/test_api',
      duration: 60,
      nb_users: 2
    });
  });

  describe('Method Save', function() {

    it('should be able to save without problems', function(done) {
      return launch.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name',
      function(done) {
        launch.name = undefined;

        return launch.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it('should be able to show an error when try to save without server',
      function(done) {
        launch.server = undefined;

        return launch.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it('should be able to show an error when try to save without api',
      function(done) {
        launch.api = undefined;

        return launch.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it('should be able to show an error when try to save without duration',
      function(done) {
        launch.duration = undefined;

        return launch.save(function(err) {
          should.exist(err);
          done();
        });
      });
    it('should be able to show an error when try to save without non-number duration',
      function(done) {
        launch.duration = 'foo';

        return launch.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it('should be able to show an error when try to save without nb_users',
      function(done) {
        launch.nb_users = undefined;

        return launch.save(function(err) {
          should.exist(err);
          done();
        });
      });
    it('should be able to show an error when try to save without non-number nb_users',
      function(done) {
        launch.nb_users = 'foo';

        return launch.save(function(err) {
          should.exist(err);
          done();
        });
      });
  });

  afterEach(function(done) {
    Launch.remove().exec();

    done();
  });
});
