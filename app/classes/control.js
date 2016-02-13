/* Control first time */

module.exports = function(bookshelf, Light, Controller) {

  var Requester = require('./requester.js');

  new Controller()
  .fetchAll()
  .then(function(controllers) {
    if (controllers.length === 0) {
      Requester.postController()
      .then(function(controller) {
        new Controller()
        .save(controller)
        .then(function(controller) {
          return fetchLights(controller.id);
        });
      });
    } else {
      return fetchLights(controllers.models[0].id);
    }
  });

  function fetchLights(controllerID) {
    new Light( { 'controller_id': controllerID } )
    .fetchAll()
    .then(function(lights) {
      if (lights.length === 0) {
        Requester.postLight(controllerID)
        .then(function(light) {
          console.log(light);
          new Light()
          .save(light)
          .then(function(light) {
            console.log(light.id);
            return true;
          });
        });
      } else {
        return false;
      }
    });
  };
};
