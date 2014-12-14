'use strict';

module.exports = function (app) {
    var launcher = require('../../app/controllers/launcher.server.controller');

    app.route('/launch').get(launcher.run);

    app.get('socketio').on('connection', function (socket) {
        var runningLaunches = false,
            refresh = setInterval(function () {
                launcher.listRunning(function (results) {
                    if (results.length !== 0) {
                        socket.emit('running.launches', {
                            launches: results
                        });
                        runningLaunches = true;
                    } else if (runningLaunches) {
                        socket.emit('running.launches', {
                            launches: results
                        });
                        runningLaunches = false;
                    }
                });
            }, 500);
        socket.on('disconnect', function () {
            clearInterval(refresh);
        });
    });
};
