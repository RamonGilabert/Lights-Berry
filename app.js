var express = require('express');
var app = express();
var databaseAddress = process.env.DATABASE_URL || 'postgres://localhost';
var bookshelf = require('./app/classes/database.js')(databaseAddress);

console.log(bookshelf);

app.set('port', 6000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(app.get('port'), function() {

  var Light = require('./app/models/Light.js')(bookshelf);
  var Controller = require('./app/models/Controller.js')(bookshelf);

  new Light().fetchAll().then(function(lights) {
    console.log(lights);
  });

  console.log('Node app is running on port', app.get('port'));
});
