/* Control first time */

var Requester = require('../classes/requester.js');
var serialPort = require('bluetooth-serial-port');
var bluetooth = new serialPort.BluetoothSerialPort();

module.exports = {

  Requester: Requester,
  bluetooth: bluetooth,

  checkFlow: function(bookshelf, Light, Controller) {
    return new Promise(function(resolve, reject) {
      new Controller()
      .fetchAll()
      .then(function(controllers) {
        if (controllers.length === 0) {
          Requester.postController()
          .then(function(controller) {
            new Controller()
            .save(controller)
            .then(function(controller) {
              module.exports.checkLights(controller.id, bookshelf, Light)
              .then(function(light) {
                resolve(light);
              });
            });
          });
        } else {
          module.exports.checkLights(controllers.models[0].id, bookshelf, Light)
          .then(function(light) {
            resolve(light);
          });
        }
      });
    });
  },

  checkLights: function(controllerID, bookshelf, Light) {
    return new Promise(function(resolve, reject) {
      new Light( { 'controller_id': controllerID } )
      .fetchAll()
      .then(function(lights) {
        if (lights.length === 0) {
          bluetooth.on('found', function(address, name) {
            // TODO: Change for arduino.
            if (name === 'Ramon\'s iPhone') {
              Requester.postLight(controllerID, address)
              .then(function(light) {
                new Light()
                .save(light)
                .then(function(light) {
                  resolve(light.attributes);
                });
              });
            }
          });

          bluetooth.inquire();
        } else {
          resolve(lights.models[0].attributes);
        }
      });
    });
  }
};
