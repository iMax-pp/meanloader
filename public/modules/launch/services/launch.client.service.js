'use strict';

angular.module('launch').factory('Launch', ['$resource',
    function($resource) {
        return {
            List: $resource('launches', {}, {
                query: {
                    isArray: true,
                    transformResponse: function(data, headersGetter) {
                        if (headersGetter('Content-Type').indexOf('text/html') !== -1) {
                            return new DOMParser().parseFromString(data, 'text/html')
                                .body.querySelector('.container').innerText;
                        }
                        return angular.fromJson(data);
                    }
                }
            }),
            Run: $resource('launch', {
                name: '@name',
                server: '@server',
                api: '@api',
                nb_users: '@nb_users',
                duration: '@duration'
            }, {
                get: {
                    transformResponse: function(data, headersGetter) {
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
]);
