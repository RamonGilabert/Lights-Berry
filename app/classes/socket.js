/* Socket handler */

module.exports = function(controllerID, bookshelf) {

  var io = require('socket.io-client');
  var socket = io.connect('https://lights-backend.herokuapp.com', { reconnect: true });
  var Light = require('../models/light.js')(bookshelf);

  socket.on('connect', function() {
    console.log('A light connected to the central server.');

    socket.emit('ios-light', {
      id: 5,
      controllerID: 5,
      status: true,
      intensity: 1,
      red: 1,
      green: 1,
      blue: 1,
      token: 'jlk0aefk8d0tpag820prosop9b7f'
    });
  });

  socket.on('light-' + controllerID, function(light) {
    new Light()
    .fetch({ 'id' : light.id })
    .then(function(bookshelfLight) {
      if (parseInt(bookshelfLight.attributes['controller_id']) === parseInt(controllerID)) {
        bookshelfLight.save({
          'updated' : new Date(),
          'status' : light.light.status,
          'intensity' : light.light.intensity,
          'red' : light.light.red,
          'blue' : light.light.blue,
          'green' : light.light.green
        }, { patch : true })

        // TODO: Change values in the RBPi.
      }
    });
  });
};
