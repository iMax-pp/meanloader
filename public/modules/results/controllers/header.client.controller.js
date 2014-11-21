'use strict';

angular.module('results').controller('HeaderController', ['$scope',
    function($scope) {
        $scope.isCollapsed = false;

        $scope.toggleCollapsibleMenu = function() {
            $scope.isCollapsed = !$scope.isCollapsed;
        };

        // Collapsing the menu after navigation
        $scope.$on('$stateChangeSuccess', function() {
            $scope.isCollapsed = false;
        });
    }
]);
