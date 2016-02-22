/* Control first time */

var Requester = require('../classes/requester.js');
var serialPort = require('bluetooth-serial-port');
var bluetooth = new serialPort.BluetoothSerialPort();

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
              resolve(controller.id);
            });
          });
        } else {
          resolve(controllers.models[0].id);
        }
      });
    });
  }
};
