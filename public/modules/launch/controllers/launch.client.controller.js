'use strict';

angular.module('launch').controller('LaunchController', ['$scope', '$window',
  'Launch', 'Socket',
  function($scope, $window, Launch, Socket) {

    $scope.alerts = [];
    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
    var addAlert = function(error) {
      var alert, noSuchAlert;
      if (error.data) {
        alert = {
          type: 'danger',
          msg: error.data.message || error.data
        };
      } else if (error.status === 0) {
        alert = {
          type: 'danger',
          msg: 'Server is unavailable'
        };
      } else {
        alert = {
          type: 'danger',
          msg: 'An error occurred (status ' + error.status + ')'
        };
      }
      noSuchAlert = $scope.alerts.filter(function(al) {
        return al.msg === alert.msg;
      }).length === 0;
      if (noSuchAlert) {
        $scope.alerts.push(alert);
      }
    };

    var indexOfById = function(array, item) {
      return array.map(function(it) {
        return it._id;
      }).indexOf(item._id);
    };

    // Listen for list of running Launches (via websocket)
    $scope.launches = [];
    // Whenever the server emits 'running launches', update the list
    Socket.on('running.launches', function(data) {
      if ($scope.launches.length === 0) {
        $scope.launches = data.launches;
        return;
      }
      data.launches.forEach(function(launch) {
        if (indexOfById($scope.launches, launch) === -1) {
          $scope.launches.unshift(launch);
        }
      });
      $scope.launches.forEach(function(launch) {
        if (indexOfById(data.launches, launch) === -1) {
          $scope.launches.splice($scope.launches.indexOf(launch), 1);
        }
      });
      data.launches.forEach(function(launch) {
        var diff = (Date.now() - Date.parse(launch.start_date)) / 1000;
        $scope.launches[indexOfById($scope.launches, launch)].progress =
          (diff / launch.duration) * 100;
      });
    });

    // Run a Load Test
    $scope.run = function(launch) {
      Launch.Run.get(launch, function() {
        console.log('successfully launch load test ' + launch.name);
      }, function(error) {
        addAlert(error);
      });
    };
  }
]);
