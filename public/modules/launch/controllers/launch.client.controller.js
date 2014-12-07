'use strict';

angular.module('launch').controller('LaunchController', ['$scope', '$window',
    'Launch',
    function($scope, $window, Launch) {

        $scope.alerts = [];
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };
        var addAlert = function(error) {
            var alert;
            if (error.data) {
                alert = {
                    type: 'danger',
                    msg: error.data.message ? error.data.message : error.data
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
            var noSuchAlert = $scope.alerts.filter(function(al) {
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

        // Find a list of Launches in_progress
        $scope.launches = [];
        $scope.find = function() {
            var launches = Launch.List.query(function() {
                if ($scope.launches.length === 0) {
                    $scope.launches = launches;
                    return;
                }

                launches.forEach(function(launch) {
                    if (indexOfById($scope.launches, launch) === -1) {
                        $scope.launches.unshift(launch);
                    }
                });
                $scope.launches.forEach(function(launch) {
                    if (indexOfById(launches, launch) === -1) {
                        $scope.launches.splice($scope.launches.indexOf(launch), 1);
                    }
                });
                launches.forEach(function(launch) {
                    var diff = (Date.now() - Date.parse(launch.start_date)) / 1000;
                    console.log(diff);
                    $scope.launches[indexOfById($scope.launches, launch)].progress =
                        (diff / launch.duration) * 100;
                });
            }, function(error) {
                addAlert(error);
            });
        };

        // Run a Load Test
        $scope.run = function(launch) {
            Launch.Run.get(launch, function() {
                console.log('successfully launch load test ' + launch.name);
            }, function(error) {
                addAlert(error);
            });
        };

        // Refresh data every half-second
        var refresh = setInterval(function() {
            $scope.find();
        }, 500);
        $scope.$on('$destroy', function() {
            clearInterval(refresh);
        });

    }
]);
