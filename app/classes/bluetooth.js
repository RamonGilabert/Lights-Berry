/* Bluetooth handler */

module.exports = function(controllerID, bookshelf) {

  var Controller = require('../models/controller.js')(bookshelf);
  var Light = require('../models/light.js')(bookshelf);
  var Requester = require('../classes/requester.js');
  var serialPort = require('bluetooth-serial-port');
  var bluetooth = new serialPort.BluetoothSerialPort();

  new Light()
  .fetchAll()
  .then(function(bookshelfLights) {
    var addresses = [];

    bookshelfLights.models.forEach(function(light) {
      addresses.push(light.attributes.address);
    });

    bluetooth.on('found', function(address, name) {
      if (name === 'Ramon\'s iPad' && addresses.indexOf(address) < 0) { // TODO: Do the same thing here, change for arduino. That will always be running.
        addresses.push(address);
        Requester.postLight(controllerID, address)
        .then(function(light) {
          new Light()
          .save(light)
          .then(function(light) {
            console.log('A new light was saved!');
          });
        });
      }
    });

    bluetooth.inquire();
  });

  new Controller()
  .fetch({ 'id' : controllerID })
  .then(function(controller) {
    if (controller.attributes['phone_id'] === null) {
      bluetooth.on('found', function(address, name) {
        if (name === 'Ramon\'s iPhone') {
          controller
          .save({ 'phone_id' : address }, { patch : true })
          .then(function(controller) {
            // TODO: Uncomment those lines when in the app.
            // bluetooth.findSerialPortChannel(address, function(channel) {
            //   bluetooth.connect(address, channel, function() {
            //     // TODO: Write the real data, which is the controller and the light information.
            //     bluetooth.write(new Buffer('my data', 'utf-8'));
            //   });
            //
            //   bluetooth.close();
            // });
          });

          bluetooth.close();
        }
      });

      bluetooth.inquire();
    }
  });
};
