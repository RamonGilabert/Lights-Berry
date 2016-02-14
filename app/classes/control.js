/* Control first time */

var Requester = require('./requester.js');

module.exports = {

  Requester: Requester,

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
              .then(function() {
                resolve(controller.id);
              });
            });
          });
        } else {
          module.exports.checkLights(controllers.models[0].id, bookshelf, Light)
          .then(function() {
            resolve(controllers.models[0].id);
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
          Requester.postLight(controllerID)
          .then(function(light) {
            new Light()
            .save(light)
            .then(function(light) {
              resolve();
            });
          });
        } else {
          resolve();
        }
      });
    });
  }
};
