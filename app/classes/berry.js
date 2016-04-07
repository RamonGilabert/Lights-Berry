/* The berry controller */

var lights = [];
var peripherals = [];
var characteristics = [];

light = function(light) {
  lights.forEach(function(berry) {
    if (berry === light.id) {
      var index = lights.indexOf(berry);
      var characteristic = characteristics[index];
      var lightOn = 0;

      if (light.status) {
        lightOn = 1;
      }

      characteristic.write(new Buffer([
        Math.floor(light.red * 255 * lightOn * light.intensity),
        Math.floor(light.green * 255 * lightOn * light.intensity),
        Math.floor(light.blue * 255 * lightOn * light.intensity)]), true);
    }
  });
};

lightsOff = function() {
  characteristics.forEach(function(characteristic) {
    var index = characteristics.indexOf(characteristic);
    var peripheral = peripherals[index];

    characteristic.write(new Buffer([0, 0, 0]), true);
    peripheral.disconnect();
  });
}

exports.lights = lights;
exports.peripherals = peripherals;
exports.characteristics = characteristics;
exports.light = light;
exports.lightsOff = lightsOff;
