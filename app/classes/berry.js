/* The berry controller */

module.exports = function(light) {
  var rpio = require('rpio');

  var redPin = 12;
  var greenPin = 32;
  var bluePin = 33;
  var pins = [redPin, greenPin, bluePin];
  var range = 255;
  var clockDivider = 8;

  pins.forEach(function(pin) {
    rpio.open(pin, rpio.PWM);
    rpio.pwmSetClockDivider(clockDivider);
    rpio.pwmSetRange(pin, range);
  });

  rpio.pwmSetData(redPin, light.red * light.intensity * 255);
  rpioGreen.pwmSetData(greenPin, light.green * light.intensity * 255);
  rpioTwo.pwmSetData(bluePin, light.blue * light.intensity * 255);

  process.on('SIGINT', function() {
    pins.forEach(function(pin) { rpio.close(pin); });
    process.exit(0);
  });
};
