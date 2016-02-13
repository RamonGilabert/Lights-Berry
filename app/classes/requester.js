/* Request manager */

var request = require("request");
var routeAPI = 'https://lights-backend.herokuapp.com';

module.exports = {

  request: request,
  routeAPI: routeAPI,

  postController: function() {
    this.postHelper('/controllers').then(function(body) {
      console.log(body);
    });
  },

  postLight: function() {
    this.postHelper('/lights').then(function(body) {
      console.log(body);
    });
  },

  postHelper: function(route) {
    return new Promise(function(resolve, reject) {
      request({
        uri: routeAPI + route,
        method: 'POST',
        headers: {
          'admin': 'true'
        }
      }, function(error, response, body) {
        resolve(body);
      });
    });
  }
};
