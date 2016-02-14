/* Socket handler */

module.exports = function(controllerID) {

  var io = require('socket.io-client');
  var socket = io.connect('http://localhost:5000', { reconnect: true });

  socket.on('connect', function() {
    console.log('A light connected to the central server.');

    socket.emit('server-light', { controllerID: 2 });
  });

  socket.on('light-' + controllerID, function(light) {
    // TODO: Edit the light and the values in the DB.
    console.log(light);
  });
};
