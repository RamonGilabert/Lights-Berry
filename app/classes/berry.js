/* The berry controller */

module.exports = function() {
  var rpio = require('rpio');

  var pins = [17, 27, 22];
  var range = 1024;
  var clockDivider = 8;
  var interval = 5;

  for (pin in pins) {
    rpio.open(pin, rpio.PWM);
    rpio.pwmSetClockDivider(clockDivider);
    rpio.pwmSetRange(pin, range);
  }

  var direction = 1;
  var data = 0;
  var pulse = setInterval(function() {
    console.log('Sup');
    rpio.pwmSetData(pin, data);
    if (data === 0) {
      direction = 1;
    } else if (data === max) {
      direction = -1;
    }

    data += direction;
  }, interval, data, direction);
};
