var express = require('express');
var app = express();
var databaseAddress = process.env.DATABASE_URL || 'postgres://localhost';
var bookshelf = require('./app/classes/database.js')(databaseAddress);
var rpio = require('rpio');

var Controller = require('./app/models/controller.js')(bookshelf);
var Light = require('./app/models/light.js')(bookshelf);

var Requester = require('./app/classes/requester.js');
var control = require('./app/classes/control.js');
var berry = require('./app/classes/berry.js');

rpio.open(11, rpio.OUTPUT, rpio.LOW);

berry.databaseAddress = databaseAddress;

app.set('port', 6000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));

  rpio.write(11, rpio.HIGH);

  control.checkFlow(bookshelf, Light, Controller)
  .then(function(controller) {

    console.log("Updating the database.");
    Requester.getLights(controller.id)
    .then(function(lights) {
      if (lights.length === 0) {
        require('./app/classes/socket.js')(controller.id, bookshelf, berry);
        require('./app/classes/bluetooth.js')(controller, bookshelf, berry);
      } else {
        lights.forEach(function(light) {
          new Light({ 'id' : light.id })
          .fetch()
          .then(function(bookshelfLight) {
            bookshelfLight.save({
              'updated' : new Date(),
              'status' : light.status,
              'intensity' : light.intensity,
              'red' : light.red,
              'blue' : light.blue,
              'green' : light.green
            }, { patch : true })
            .then(function() {
              console.log("Done updating the database");

              require('./app/classes/socket.js')(controller.id, bookshelf, berry);
              require('./app/classes/bluetooth.js')(controller, bookshelf, berry);
            })
          });
        });
      }
    });
  });
});


process.stdin.resume();
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

function shutdown() {
  rpio.close(11);
  console.log("Closing Lights.");
}
