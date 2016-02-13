var express = require('express');
var app = express();
var databaseAddress = process.env.DATABASE_URL || 'postgres://localhost';
var bookshelf = require('./app/classes/database.js')(databaseAddress);
var Controller = require('./app/models/controller.js')(bookshelf);
var Light = require('./app/models/light.js')(bookshelf);

app.set('port', 6000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));

  var control = require('./app/classes/control.js')(bookshelf, Light, Controller);
});
