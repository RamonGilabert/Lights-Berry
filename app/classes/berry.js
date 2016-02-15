/* The berry controller */

module.exports = function() {
  var rpio = require('rpio');

  var pins = [12, 32, 33];
  var range = 1024;
  var max = 128;
  var clockDivider = 8;
  var interval = 1000;

  for (pin in pins) {
    rpio.open(pins[pin], rpio.PWM);
    rpio.pwmSetClockDivider(clockDivider);
    rpio.pwmSetRange(pins[pin], range);
  }

  var direction = 1;
  var data = 0;
  var pulse = setInterval(function() {
    for (pin in pins) {
      rpio.pwmSetData(pins[pin], 128);
    }
  }, interval, data, direction);
};
