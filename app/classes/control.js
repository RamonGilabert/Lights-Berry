/* Control first time */

module.exports = function(bookshelf, Light, Controller) {

  new Controller()
  .fetchAll()
  .then(function(controllers) {
    if (controllers.length === 0) {
      // TODO: Post to the database and return the method from fetchLights.
    } else {
      return fetchLights(controllers.models[0].id);
    }
  });

  function fetchLights(controllerID) {
    console.log(controllerID);
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
