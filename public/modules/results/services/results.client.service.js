'use strict';

// Results service used to communicate Results REST endpoints
angular.module('results').factory('Results', ['$resource',
    function ($resource) {
        return {
            result: $resource('results/:resultId', {
                resultId: '@_id'
            }, {
                get: {
                    transformResponse: function (data, headersGetter) {
                        if (data === '') {
                            return '';
                        }
                        if (headersGetter('Content-Type').indexOf('text/html') !== -1) {
                            return new DOMParser().parseFromString(data, 'text/html')
                                .body.querySelector('.container').innerText;
                        }
                        return angular.fromJson(data);
                    }
                },
                query: {
                    isArray: true,
                    transformResponse: function (data, headersGetter) {
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
            }),
            count: $resource('nb_results', {}, {
                get: {
                    transformResponse: function (data) {
                        if (data === '') {
                            return '';
                        }
                        return {count: data};
                    }
                }
            })
        };
    }]);
