/* Socket handler */

var io = require('socket.io-client');
var socket = io.connect('http://localhost:5000', { reconnect: true });

socket.on('connect', function() {
  console.log('A light connected to the central server.');

  socket.emit('ios-light', { light: 'Put those values in there.' });
});

socket.on('light', function(light) {
  // TODO: Edit the light.
  console.log(light);
});
