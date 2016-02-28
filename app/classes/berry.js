/* The berry controller */

var Requester = require('../classes/requester.js');
var bluetooth = {};
var databaseAddress = "";

module.exports = {

  bluetooth: bluetooth,

  lightsOff: function(controllerID, bookshelf, bluetooth) {
    var Light = require('../models/light.js')(bookshelf);
    new Light()
    .fetchAll()
    .then(function(lights) {
      module.exports.bluetooth.write(new Buffer([0, 0, 0]), function(error, bytes) {
        module.exports.bluetooth.close();
        process.exit();
      });
    });
  },

  light: function(light) {
    var lightOn = (light.status === true || String(light.status) === String(true)) ? 1 : 0;
    module.exports.bluetooth.write(new Buffer([light.red * 255 * lightOn * light.intensity,
      light.green * 255 * lightOn * light.intensity,
       light.blue * 255 * lightOn * light.intensity]), function(error, bytes) {
        if (error) { console.log(error); }
      });
  },

  connectLight: function(light) {
    var interval = setInterval(function() {
      module.exports.bluetooth.connect(light.address, 1, function() {
        clearInterval(interval);
        console.log('Connected via Bluetooth');
        var lightOn = (light.status === true || String(light.status) === String(true)) ? 1 : 0;

        module.exports.bluetooth.write(new Buffer([light.red * 255 * lightOn * light.intensity,
          light.green * 255 * lightOn * light.intensity,
          light.blue * 255 * lightOn * light.intensity]), function(error, bytes) {
            if (error) { console.log(error); }
          });
      });
    });
  },

  lights: function(lights) {
    this.connectLight(lights.models[0].attributes);
  }
};
