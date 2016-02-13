/* Control first time */

module.exports = function(bookshelf, Light, Controller) {

  var Requester = require('./requester.js');

  new Controller()
  .fetchAll()
  .then(function(controllers) {
    if (controllers.length === 0) {
      Requester.postController();
    } else {
      return fetchLights(controllers.models[0].id);
    }
  });

  function fetchLights(controllerID) {
    new Light( { 'controller_id': controllerID } )
    .fetchAll()
    .then(function(lights) {
      if (lights.length === 0) {
        // TODO: Post to the database and return true.
        console.log("0 lights.");
      } else {
        return false;
      }
    });
  };
};
