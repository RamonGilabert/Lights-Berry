/* Socket handler */

module.exports = function(controllerID, bookshelf) {

  var io = require('socket.io-client');
  var socket = io.connect('http://localhost:5000', { reconnect: true });
  var Light = require('../models/light.js');

  socket.on('connect', function() {
    console.log('A light connected to the central server.');

    socket.emit('ios-light', {
      id: 2,
      controllerID: 2,
      status: false,
      intensity: 1,
      red: 1,
      green: 1,
      blue: 1
    });
  });

  socket.on('light-' + controllerID, function(light) {
    new Light({ 'id' : light.id })
      .fetch()
      .then(function(bookshelfLight) {
        if (parseInt(bookshelfLight.attributes['controller_id']) === parseInt(controllerID)) {
          bookshelfLight.save({
            'updated' : new Date(),
            'status' : light.status,
            'intensity' : light.intensity,
            'red' : light.red,
            'blue' : light.blue,
            'green' : light.green
          }, { patch : true })

          // TODO: Change values in the RBPi.
        }
      });
    });
  });
};
