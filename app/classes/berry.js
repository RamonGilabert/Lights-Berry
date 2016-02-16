/* The berry controller */

var rpio = require('rpio');
var redPin = 12;
var greenPin = 32;
var bluePin = 33;
var pins = [redPin, greenPin, bluePin];
var range = 255;
var clockDivider = 8;

module.exports = {

  light: function(light) {
    if (light.status) {
      pins.forEach(function(pin) {
        rpio.open(pin, rpio.PWM);
        rpio.pwmSetClockDivider(clockDivider);
        rpio.pwmSetRange(pin, range);
      });

      rpio.pwmSetData(redPin, light.red * light.intensity * 255);
      rpio.pwmSetData(greenPin, light.green * light.intensity * 255);
      rpio.pwmSetData(bluePin, light.blue * light.intensity * 255);
    } else {
      pins.forEach(function(pin) {
        rpio.open(pin, rpio.PWM);
        rpio.close(pin);
      });
    }
  }
};

process.on('SIGINT', function() {
  pins.forEach(function(pin) { rpio.close(pin); });
  process.exit(0);
});
