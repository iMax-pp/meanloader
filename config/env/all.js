'use strict';

module.exports = {
    app: {
        title: 'MeanLoader',
        description: 'MEAN.JS Application to Test Load APIs',
        keywords: 'MongoDB, Express, AngularJS, Node.js'
    },
    port: process.env.PORT || 3000,
    templateEngine: 'swig',
    sessionSecret: 'MEAN',
    sessionCollection: 'sessions',
    assets: {
        lib: {
            css: [
                'public/lib/bootstrap/dist/css/bootstrap.css',
                'public/lib/bootstrap-material-design/dist/css/material.min.css',
                'public/lib/bootstrap-material-design/dist/css/material-wfont.min.css',
                'public/lib/bootstrap-material-design/dist/css/ripples.min.css'
            ],
            js: [
                'public/lib/angular/angular.js',
                'public/lib/angular-resource/angular-resource.js',
                'public/lib/angular-animate/angular-animate.js',
                'public/lib/angular-sanitize/angular-sanitize.js',
                'public/lib/angular-ui-router/release/angular-ui-router.js',
                'public/lib/angular-ui-utils/ui-utils.js',
                'public/lib/angular-bootstrap/ui-bootstrap.js',
                'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
                'public/lib/angular-socket-io/socket.js',
                'public/lib/socket.io-client/socket.io.js',
                'public/lib/jquery/dist/jquery.js',
                'public/lib/highcharts/highcharts.src.js',
                'public/lib/highcharts/modules/exporting.js',
                'public/lib/bootstrap-material-design/dist/js/material.min.js',
                'public/lib/bootstrap-material-design/dist/js/ripples.js'
            ]
        },
        css: [
            'public/modules/**/css/*.css'
        ],
        js: [
            'public/config.js',
            'public/application.js',
            'public/modules/*/*.js',
            'public/modules/*/*[!tests]*/*.js'
        ],
        tests: [
            'public/lib/angular-mocks/angular-mocks.js',
            'public/modules/*/tests/*.js'
        ]
    }
};
