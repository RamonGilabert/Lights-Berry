var express = require('express');
var app = express();
var databaseAddress = process.env.DATABASE_URL || 'postgres://localhost';
var bookshelf = require('./app/classes/database.js')(databaseAddress);
var io = require('socket.io-client');
var socket = io.connect('https://lights-backend.herokuapp.com', { reconnect: true });

var Controller = require('./app/models/controller.js')(bookshelf);
var Light = require('./app/models/light.js')(bookshelf);

var control = require('./app/classes/control.js');

app.set('port', 6000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));

  // TODO: Uncomment those lines when working on that.
  // control.checkFlow(bookshelf, Light, Controller)
  // .then(function(result) {
  //   console.log(result)
  // });
});

socket.on('connect', function(socket) {
  console.log('Values should be set to the Raspberry Pi now.');
});
