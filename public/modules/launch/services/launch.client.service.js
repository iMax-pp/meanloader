'use strict';

angular.module('launch').factory('Launch', ['$resource',
    function($resource) {
        return {
            List: $resource('launches'),
            Run: $resource('launch', {
                name: '@name',
                server: '@server',
                api: '@api',
                nb_users: '@nb_users',
                duration: '@duration'
            }),
        };
    }
]);
