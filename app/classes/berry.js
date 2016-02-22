/* The berry controller */

var serialPort = require('bluetooth-serial-port');
var bluetooth = new serialPort.BluetoothSerialPort();

module.exports = {

  light: function(light) {
    var address = light.address;

    btSerial.findSerialPortChannel(address, function(channel) {
      btSerial.connect(address, channel, function() {
        console.log('Connected via Bluetooth');
        // TODO: Send the light information.
        btSerial.write(new Buffer('data', 'utf-8'));
      });

      btSerial.close();
    });
  },

  lights: function(controllerID, bookshelf) {
    new Light()
    .fetchAll()
    .then(function(lights) {
      lights.modules.forEach(function(light) {
        var address = light.attributes.address;

        btSerial.findSerialPortChannel(address, function(channel) {
          btSerial.connect(address, channel, function() {
            console.log('Connected via Bluetooth');
            // TODO: Send the light information.
            btSerial.write(new Buffer('data', 'utf-8'));
          });

          btSerial.close();
        });
      });
    });
  }
};
