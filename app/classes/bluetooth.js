/* Bluetooth handler */

module.exports = function(controllerID, bookshelf) {

  var Controller = require('../models/controller.js')(bookshelf);
  var serialPort = require('bluetooth-serial-port');
  var bluetooth = new serialPort.BluetoothSerialPort();

  new Controller({ 'id' : controllerID })
  .fetch()
  .then(function(controller) {
    if (controller.attributes['phone_id'] === null) {
      bluetooth.on('found', function(address, name) {
        if (name === 'Ramon\'s iPhone') {
          new Controller({ 'id' : controllerID })
          .save({ 'phone_id' : address }, { patch: true })
          .then(function(controller) {
            bluetooth.findSerialPortChannel(address, function(channel) {
              bluetooth.connect(address, channel, function() {
                // TODO: Write the real data, which is the controller and the light information.
                bluetooth.write(new Buffer('my data', 'utf-8'));
              });

              bluetooth.close();
            });
          });
        }
      });

      bluetooth.inquire();
    }
  });
};
