/* Control first time */

var Requester = require('../classes/requester.js');

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
              resolve(controller.attributes);
            });
          });
        } else {
          resolve(controllers.models[0].attributes);
        }
      });
    });
  }
};
