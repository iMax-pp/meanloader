'use strict';

angular.module('launch').controller('LaunchController', ['$scope', '$window',
    'Launch',
    function($scope, $window, Launch) {

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
            });
        };

        // Run a Load Test
        $scope.run = function(launch) {
            Launch.Run.get(launch);
            $window.location.reload();
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
