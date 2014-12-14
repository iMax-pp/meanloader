/* global $:false */
'use strict';

// Results controller
angular.module('results').controller('ResultsController', ['$scope', '$stateParams', 'Results',
    function ($scope, $stateParams, Results) {

        $scope.alerts = [];
        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };
        var addAlert = function (error) {
            var alert, noSuchAlert;
            if (error.data) {
                alert = {
                    type: 'danger',
                    msg: error.data.message || error.data
                };
            } else if (error.status === 0) {
                alert = {
                    type: 'danger',
                    msg: 'Server is unavailable'
                };
            } else {
                alert = {
                    type: 'danger',
                    msg: 'An error occurred (status ' + error.status + ')'
                };
            }
            noSuchAlert = $scope.alerts.filter(function (al) {
                return al.msg === alert.msg;
            }).length === 0;
            if (noSuchAlert) {
                $scope.alerts.push(alert);
            }
        };

        var indexOfById = function (array, item) {
            return array.map(function (it) {
                return it._id;
            }).indexOf(item._id);
        };

        // Find a list of Results
        $scope.results = [];
        $scope.find = function () {
            var results = Results.query(function () {
                if ($scope.results.length === 0) {
                    $scope.results = results;
                    return;
                }
                results.forEach(function (result) {
                    if (indexOfById($scope.results, result) === -1) {
                        $scope.results.unshift(result);
                    }
                });
            }, function (error) {
                addAlert(error);
            });
        };
        $scope.find();

        // Refresh data every minute
        var refresh = setInterval(function () {
            $scope.find();
        }, 60000);
        $scope.$on('$destroy', function () {
            clearInterval(refresh);
        });

        // Draw Result stats chart
        var drawChart = function () {
            $('#statsChart').highcharts({
                title: {text: ''},
                xAxis: {
                    title: {enabled: false},
                    labels: {
                        formatter: function () {
                            return this.value + ' s';
                        }
                    }
                },
                yAxis: [{
                    title: {text: '# Hits / seconds'},
                    floor: 0,
                    ceiling: Math.max.apply(Math, $scope.result.stats.map(function (stat) {
                        return stat.nbOK + stat.nbKO;
                    }))
                }, {
                    title: {text: 'Mean Time (ms)'},
                    floor: 0,
                    ceiling: Math.max.apply(Math, $scope.result.stats.map(function (stat) {
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
                        lineColor: 'hsl(0, 0%, 40%)',
                        lineWidth: 0.3,
                        marker: {enabled: false}
                    }
                },
                series: [{
                    yAxis: 0,
                    type: 'area',
                    name: 'KO',
                    color: 'hsla(2, 64%, 58%, 0.90)',
                    data: $scope.result.stats.map(function (stat) {
                        return stat.nbKO;
                    })
                }, {
                    yAxis: 0,
                    type: 'area',
                    name: 'OK',
                    color: 'hsla(208, 56%, 53%, 0.90)',
                    data: $scope.result.stats.map(function (stat) {
                        return stat.nbOK;
                    })
                }, {
                    yAxis: 1,
                    type: 'spline',
                    name: 'Mean Time',
                    color: 'hsl(120, 39%, 54%)',
                    data: $scope.result.stats.map(function (stat) {
                        return stat.meanTime;
                    })
                }]
            });
        };

        // Find existing Result
        $scope.findOne = function () {
            $scope.result = Results.get({
                resultId: $stateParams.resultId
            }, function () {
                drawChart();
            }, function (error) {
                addAlert(error);
            });
        };
    }]);
