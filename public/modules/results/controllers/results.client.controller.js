'use strict';

// Results controller
angular.module('results').controller('ResultsController', ['$scope', '$stateParams', 'Results',
    function($scope, $stateParams, Results) {

        var indexOfById = function(array, item) {
            return array.map(function(it) {
                return it._id;
            }).indexOf(item._id);
        };

        // Find a list of Results
        $scope.results = [];
        $scope.find = function() {
            var results = Results.query(function() {
                if ($scope.results.length === 0) {
                    $scope.results = results;
                    return;
                }
                results.forEach(function(result) {
                    if (indexOfById($scope.results, result) === -1) {
                        $scope.results.unshift(result);
                    }
                });
            });
        };

        // Find existing Result
        $scope.findOne = function() {
            $scope.result = Results.get({
                resultId: $stateParams.resultId
            });
        };

        // Refresh data every 5 seconds
        var refresh = setInterval(function() {
            $scope.find();
        }, 5000);
        $scope.$on('$destroy', function() {
            clearInterval(refresh);
        });
    }
]);
