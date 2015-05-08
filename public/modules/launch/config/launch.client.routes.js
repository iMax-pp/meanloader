'use strict';

//Setting up route
angular.module('launch').config(['$stateProvider',
  function($stateProvider) {
    // Launch state routing
    $stateProvider.
    state('launch', {
      url: '/launch',
      templateUrl: 'modules/launch/views/launch.client.view.html'
    });
  }
]);
