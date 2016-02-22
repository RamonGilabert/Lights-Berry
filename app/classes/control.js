/* Control first time */

var Requester = require('../classes/requester.js');
var serialPort = require('bluetooth-serial-port');
var bluetooth = new serialPort.BluetoothSerialPort();
var async = require('async');

module.exports = {

  Requester: Requester,
  bluetooth: bluetooth,
  async: async,

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
      new Light( { 'controller_id' : controllerID } )
      .fetchAll()
      .then(function(lights) {
        if (lights.length === 0) {
          var interval = setInterval(function() {
            bluetooth.inquire();
          });

          bluetooth.on('found', function(address, name) {
            if (name === 'Ramon\'s iPhone') { // TODO: Change for arduino.
              clearInterval(interval);
              Requester.postLight(controllerID, address)
              .then(function(light) {
                new Light()
                .save(light)
                .then(function(light) {
                  resolve([light]);
                });
              });
            }
          });
        } else {
          var attributeLights = [];

          lights.models.forEach(function(light) {
            attributeLights.push(light);
          })

          resolve(attributeLights);
        }
      });
    });
  }
};
