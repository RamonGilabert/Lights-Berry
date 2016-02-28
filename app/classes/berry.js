/* The berry controller */

var serialPort = require('bluetooth-serial-port');
var bluetooth = new serialPort.BluetoothSerialPort();
var Requester = require('../classes/requester.js');
var addresses = {};

module.exports = {

  lightsOff: function(controllerID, bookshelf) {
    return new Promise(function(resolve, reject) {
      var Light = require('../models/light.js')(bookshelf);
      new Light()
      .fetchAll()
      .then(function(lights) {
        lights.models.forEach(function(light) {
          var address = light.attributes.address;

          if (addresses[address] != undefined) {
            addresses[address].write(new Buffer([0, 0, 0]), function(error, bytes) {
              if (error) { console.log(error); }
              addresses[address].close();
              resolve();
            });
          } else {
            var bluetooth = new serialPort.BluetoothSerialPort();
            addresses[address] = bluetooth;

            bluetooth.connect(address, 1, function() {
              console.log('Connected via Bluetooth');

              bluetooth.write(new Buffer([0, 0, 0]), function(error, bytes) {
                if (error) { console.log(error); }
                bluetooth.close();
                resolve();
              });
            }, function(error) {
              console.log(error);
              bluetooth.close();
              resolve();
            });
          }
        });
      });
    });
  },

  light: function(light) {
    var address = light.address;

    if (addresses[address] != undefined) {
      var lightOn = light.status === true ? 1 : 0

      addresses[address].write(new Buffer([light.red * 255 * lightOn,
        light.green * 255 * lightOn, light.blue * 255 * lightOn]), function(error, bytes) {
          if (error) { console.log(error); }
        });
    } else {
      var bluetooth = new serialPort.BluetoothSerialPort();
      addresses[address] = bluetooth;

      bluetooth.findSerialPortChannel(address, function(channel) {
        bluetooth.connect(address, channel, function() {
          console.log('Connected via Bluetooth');
          var lightOn = light.status === true ? 1 : 0
          bluetooth.write(new Buffer([light.red * 255 * lightOn,
            light.green * 255 * lightOn, light.blue * 255 * lightOn]), function(error, bytes) {
              if (error) { console.log(error); }
            });
        });
      });
    }
  },

  lights: function(controllerID, bookshelf) {
    var Light = require('../models/light.js')(bookshelf);
    new Light()
    .fetchAll()
    .then(function(lights) {
      lights.models.forEach(function(light) {
        var address = light.attributes.address;

        if (addresses[address] != undefined) {
          addresses[address].write(new Buffer([255, 120, 200]), function(error, bytes) {
            if (error) { console.log(error); }
          });
        } else {
          var bluetooth = new serialPort.BluetoothSerialPort();
          addresses[address] = bluetooth;

          bluetooth.connect(address, 1, function() {
            console.log('Connected via Bluetooth');

            bluetooth.write(new Buffer([255, 120, 200]), function(error, bytes) {
              if (error) { console.log(error); }
            });
          }, function(error) {
            console.log(error);
          });
        }
      });
    });
  }
};
