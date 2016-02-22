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
    if (name === 'Ramon\'s iPhone' && addresses.indexOf(address) < 0) { // TODO: Do the same thing here, change for arduino. That will always be running.
      addresses.push(address);
      Requester.postLight(controllerID, address)
      .then(function(light) {
        new Light()
        .save(light)
        .then(function(light) {
          console.log('A new light was saved!');
        });
      });
    } else if (name === 'Ramon\'s iPad') {
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
            // TODO: Uncomment those lines when in the app.
            // bluetooth.findSerialPortChannel(address, function(channel) {
            //   bluetooth.connect(address, channel, function() {
            //     bluetooth.write(new Buffer('controller.attributes.id', 'utf-8'));
            //   });
            //
            //   bluetooth.close();
            // });
          });
      });
    }
  });
});
