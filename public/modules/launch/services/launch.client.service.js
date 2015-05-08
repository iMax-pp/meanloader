'use strict';

angular.module('launch').factory('Launch', ['$resource',
  function($resource) {
    return {
      Run: $resource('launch', {
        name: '@name',
        server: '@server',
        api: '@api',
        nb_users: '@nb_users',
        duration: '@duration'
      }, {
        get: {
          transformResponse: function(data, headersGetter) {
            if (data === '') {
              return '';
            }
            if (headersGetter('Content-Type').indexOf('text/html') !== -1) {
              return new DOMParser().parseFromString(data, 'text/html')
                .body.querySelector('.container').innerText;
            }
            return angular.fromJson(data);
          }
        }
      })
    };
  }
]).factory('Socket', ['socketFactory',
  function(socketFactory) {
    return socketFactory();
  }
]);
