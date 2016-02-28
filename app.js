var express = require('express');
var app = express();
var databaseAddress = process.env.DATABASE_URL || 'postgres://localhost';
var bookshelf = require('./app/classes/database.js')(databaseAddress);
var forever = require('forever-monitor');

var Controller = require('./app/models/controller.js')(bookshelf);
var Light = require('./app/models/light.js')(bookshelf);

var control = require('./app/classes/control.js');
var generalID = 0;

app.set('port', 6000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));

  control.checkFlow(bookshelf, Light, Controller)
  .then(function(controllerID) {
    generalID = controllerID;

    require('./app/classes/socket.js')(controllerID, bookshelf);

    var bluetooth = new (forever.Monitor)('./app/classes/bluetooth.js', {
      args: [controllerID, databaseAddress]
    });

    bluetooth.start();

    require('./app/classes/berry.js').lights(controllerID, bookshelf);
  });
});

process.on('SIGINT', function() {
  require('./app/classes/berry.js').lightsOff(generalID, bookshelf).then(function() {
    console.log('\nExiting the hub');
    process.exit();
  });
});
