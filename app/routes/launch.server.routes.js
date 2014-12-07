'use strict';

module.exports = function(app) {
    var launcher = require('../../app/controllers/launcher.server.controller');

    app.route('/launch').get(launcher.run);

    app.get('socketio').on('connection', function(socket) {
        var refresh = setInterval(function() {
            launcher.listRunning(function(results) {
                if (results.length !== 0) {
                    socket.emit('running.launches', {
                        launches: results
                    });
                }
            });
        }, 500);
        socket.on('disconnect', function() {
            clearInterval(refresh);
        });
    });
};
