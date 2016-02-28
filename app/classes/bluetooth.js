/* Bluetooth handler */

var controllerID = parseInt(process.argv[2]);
var databaseAddress = process.argv[3];
var bookshelf = require('../classes/database.js')(databaseAddress);
var Controller = require('../models/controller.js')(bookshelf);
var Light = require('../models/light.js')(bookshelf);
var Requester = require('../classes/requester.js');
var serialPort = require('bluetooth-serial-port');
var bluetooth = new serialPort.BluetoothSerialPort();

new Light()
.fetchAll()
.then(function(bookshelfLights) {
  var addresses = [];

  bookshelfLights.models.forEach(function(light) {
    addresses.push(light.attributes.address);
  });

  var interval = setInterval(function() {
    bluetooth.inquire();
  });

  bluetooth.on('found', function(address, name) {
    if (name === 'HC-06' && addresses.indexOf(address) < 0) {
      var exec = require('child_process').exec;
      function execute(command, callback) {
        exec(command, function(error, stdout, stderr) { console.log(error); callback(stdout); });
      };

      execute('/home/pi/Desktop/Lights-Berry/bluetooth.sh ' + address, function(callback) {
        console.log(callback);

        addresses.push(address);
        Requester.postLight(controllerID, address)
        .then(function(light) {
          new Light()
          .save(light)
          .then(function(light) {
            console.log('A new light was saved!');
            require('./berry.js').light(light.attributes);
          });
        });
      });
    } else if (name === 'Ramon\'s iPhone') {
      new Controller()
      .fetch({ 'id' : controllerID })
      .then(function(controller) {
        controller
          .save({
            'phone_id' : address,
            'updated' : new Date()
          }, { patch : true })
          .then(function(controller) {
            console.log('A new phone connected.');
            // TODO: Send the controller and the token.
          });
      });
    }
  });
});
