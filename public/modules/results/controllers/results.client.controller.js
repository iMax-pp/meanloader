'use strict';

// Results controller
angular.module('results').controller('ResultsController', ['$scope', '$stateParams', 'Results',
    function($scope, $stateParams, Results) {

        // Find a list of Results
        $scope.find = function() {
            $scope.results = Results.query();
        };

        // Find existing Result
        $scope.findOne = function() {
            $scope.result = Results.get({
                resultId: $stateParams.resultId
            });
        };
    }
]);
