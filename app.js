var express = require('express');
var app = express();
var databaseAddress = process.env.DATABASE_URL || 'postgres://localhost';
var bookshelf = require('./app/classes/database.js')(databaseAddress);
var forever = require('forever-monitor');

var Controller = require('./app/models/controller.js')(bookshelf);
var Light = require('./app/models/light.js')(bookshelf);

var control = require('./app/classes/control.js');
var generalID = 0;

var serialPort = require('bluetooth-serial-port');
var bluetooth = new serialPort.BluetoothSerialPort();
var berry = require('./app/classes/berry.js');
var shouldReconnect = true;

app.set('port', 6000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));

  berry.bluetooth = bluetooth;

  control.checkFlow(bookshelf, Light, Controller)
  .then(function(controllerID) {
    generalID = controllerID;

    require('./app/classes/socket.js')(controllerID, bookshelf, berry);

    var foreverBluetooth = new (forever.Monitor)('./app/classes/bluetooth.js', {
      args: [controllerID, databaseAddress]
    });

    foreverBluetooth.start();

    new Light()
    .fetchAll()
    .then(function(lights) {
      if (lights.length != 0) {
        berry.lights(lights);
      }
    });
  });
});

process.on('SIGINT', function() {
  shouldReconnect = false;
  berry.lightsOff(generalID, bookshelf, bluetooth);
});

bluetooth.on('closed', function() {
  if (shouldReconnect) {
    console.log('Reconnecting');

    new Light()
    .fetchAll()
    .then(function(lights) {
      if (lights.length != 0) {
        berry.lights(lights);
      }
    });
  }
});
