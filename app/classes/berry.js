/* The berry controller */

module.exports = function() {
  var rpio = require('rpio');

  var redPin = 12;
  var greenPin = 32;
  var bluePin = 33;
  var pins = [redPin, greenPin, bluePin];
  var range = 255;
  var clockDivider = 8;
  var interval = 1000;

  pins.forEach(function(pin) {
    rpio.open(pin, rpio.PWM);
    rpio.pwmSetClockDivider(clockDivider);
    rpio.pwmSetRange(pin, range);
  });

  //rpio.write(12, rpio.HIGH);

  rpio.pwmSetData(redPin, range);
  rpio.pwmSetData(greenPin, range);
  rpio.pwmSetData(bluePin, range);

  process.stdin.resume();

  process.on('SIGINT', function() {
    pins.forEach(function(pin) { rpio.close(pin); });
    process.exit(0);
  });
};
