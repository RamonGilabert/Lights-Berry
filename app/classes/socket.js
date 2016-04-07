/* Socket handler */

module.exports = function(controllerID, bookshelf, berry) {

  var io = require('socket.io-client');
  var socket = io.connect('https://lights-backend.herokuapp.com', { reconnect: true });
  var Light = require('../models/light.js')(bookshelf);
  var controlled = false;

  socket.on('connect', function() {
    console.log('A light connected to the central server.');
  });

  socket.on('connect_error', function(error) {
    console.log(error);
  });

  socket.on('light-' + controllerID, function(light) {
    berry.light(light.light);
    new Light({ 'id' : light.light.id })
    .fetch()
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
        berry.light(light.light);
      }
    });
  });

  socket.on('new-ios-light-' + controllerID, function(light) {
    if (!controlled) {
      controlled = true;
    }
  });
};
