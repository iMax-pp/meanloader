'use strict';

angular.module('launch').controller('LaunchController', ['$scope', '$window',
    'Launch',
    function($scope, $window, Launch) {

        // Find a list of Launches in_progress
        $scope.find = function() {
            $scope.launches = Launch.List.query();
        };

        // Run a Load Test
        $scope.run = function(launch) {
            Launch.Run.get(launch);
            $window.location.reload();
        };
    }
]);
