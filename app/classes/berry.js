/* The berry controller */

var serialPort = require('bluetooth-serial-port');
var bluetooth = new serialPort.BluetoothSerialPort();
var Requester = require('../classes/requester.js');
var addresses = {};

module.exports = {

  light: function(light) {
    var address = light.address;

    if (addresses[address] != undefined) {
      var bluetooth = addresses[address];

      bluetooth.write(new Buffer('data', 'utf-8'));
    } else {
      var bluetooth = new serialPort.BluetoothSerialPort();
      addresses[address] = bluetooth;

      bluetooth.findSerialPortChannel(address, function(channel) {
        bluetooth.connect(address, channel, function() {
          console.log('Connected via Bluetooth');
          // TODO: Send the light information.
          bluetooth.write(new Buffer('data', 'utf-8'));

          bluetooth.on('data', function(data) {
            Requester
            .deleteLight(light['controller_id'], light.id)
            .then(function() {
              bluetooth.close();
              delete addresses[address];
              console.log('A light has been deleted.');
            });
          });
        });
      });
    }
  },

  lights: function(controllerID, bookshelf) {
    new Light()
    .fetchAll()
    .then(function(lights) {
      lights.modules.forEach(function(light) {
        var address = light.attributes.address;

        if (addresses[address] != undefined) {
          bluetooth.write(new Buffer('data', 'utf-8'));
        } else {
          var bluetooth = new serialPort.BluetoothSerialPort();

          addresses[address] = bluetooth;

          bluetooth.findSerialPortChannel(address, function(channel) {
            bluetooth.connect(address, channel, function() {
              console.log('Connected via Bluetooth');
              // TODO: Send the light information.
              bluetooth.write(new Buffer('data', 'utf-8'));

              bluetooth.on('data', function(data) {
                Requester
                .deleteLight(light.attributes['controller_id'], light.attributes.id)
                .then(function() {
                  bluetooth.close();
                  delete addresses[address];
                  console.log('A light has been deleted.');
                });
              });
            });
          });
        }
      });
    });
  }
};
