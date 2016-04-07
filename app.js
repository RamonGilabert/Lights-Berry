var express = require('express');
var app = express();
var databaseAddress = process.env.DATABASE_URL || 'postgres://localhost';
var bookshelf = require('./app/classes/database.js')(databaseAddress);
var forever = require('forever-monitor');
var util = require('util')
var exec = require('child_process').exec;

var Controller = require('./app/models/controller.js')(bookshelf);
var Light = require('./app/models/light.js')(bookshelf);

var control = require('./app/classes/control.js');
var berry = require('./app/classes/berry.js');

berry.databaseAddress = databaseAddress;
process.stdin.resume();

app.set('port', 6000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));

  control.checkFlow(bookshelf, Light, Controller)
  .then(function(controller) {
    require('./app/classes/socket.js')(controller.id, bookshelf, berry);
    require('./app/classes/bluetooth.js')(controller, bookshelf, berry);
  });
});

process.on('SIGINT', function() {
  berry.lightsOff(); // TODO: Implement.
  process.exit();
});
