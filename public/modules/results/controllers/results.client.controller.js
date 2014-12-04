/* global $:false */
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
            }, function(result) {
                drawChart();
                return result;
            });
        };

        // Refresh data every 5 seconds
        var refresh = setInterval(function() {
            $scope.find();
        }, 5000);
        $scope.$on('$destroy', function() {
            clearInterval(refresh);
        });

        var drawChart = function() {
            $('#statsChart').highcharts({
                title: {
                    text: ''
                },
                xAxis: {
                    title: {
                        enabled: false
                    },
                    labels: {
                        formatter: function() {
                            return this.value + ' s';
                        }
                    }
                },
                yAxis: [{
                    title: {
                        text: '# Hits / seconds'
                    },
                    floor: 0,
                    ceiling: Math.max.apply(Math, $scope.result.stats.map(function(
                        stat) {
                        return stat.nbOK + stat.nbKO;
                    }))
                }, {
                    title: {
                        text: 'Mean Time (ms)'
                    },
                    floor: 0,
                    ceiling: Math.max.apply(Math, $scope.result.stats.map(function(
                        stat) {
                        return stat.meanTime;
                    })),
                    opposite: true
                }],
                tooltip: {
                    shared: true,
                    crosshairs: [true, false]
                },
                plotOptions: {
                    area: {
                        stacking: 'normal',
                        lineColor: '#666666',
                        lineWidth: 0.3,
                        marker: {
                            enabled: false
                        }
                    }
                },
                series: [{
                    yAxis: 0,
                    type: 'area',
                    name: 'KO',
                    color: 'hsla(360, 100%, 50%, 0.75)',
                    data: $scope.result.stats.map(function(stat) {
                        return stat.nbKO;
                    })
                }, {
                    yAxis: 0,
                    type: 'area',
                    name: 'OK',
                    color: 'hsla(240, 100%, 50%, 0.75)',
                    data: $scope.result.stats.map(function(stat) {
                        return stat.nbOK;
                    })
                }, {
                    yAxis: 1,
                    type: 'spline',
                    name: 'Mean Time',
                    color: 'hsl(120, 50%, 50%)',
                    data: $scope.result.stats.map(function(stat) {
                        return stat.meanTime;
                    })
                }]
            });
        };
    }
]);
