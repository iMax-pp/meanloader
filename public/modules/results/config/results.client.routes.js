'use strict';

//Setting up route
angular.module('results').config(['$stateProvider',
  function($stateProvider) {
    // Results state routing
    $stateProvider.
    state('listResults', {
      url: '/results',
      templateUrl: 'modules/results/views/list-results.client.view.html'
    }).
    state('viewResult', {
      url: '/results/:resultId',
      templateUrl: 'modules/results/views/view-result.client.view.html'
    });
  }
]);
