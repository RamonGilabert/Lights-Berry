/* Request manager */

var request = require('request');
var routeAPI = 'https://lights-backend.herokuapp.com';

module.exports = {

  request: request,
  routeAPI: routeAPI,

  postController: function() {
    var headers = {
      'content-type' : 'application/json',
      'admin' : 'true'
    }

    return this.postHelper('/controllers', headers).then(function(body) {
      return new Promise(function(resolve, reject) {
        resolve(JSON.parse(body).controller);
      });
    });
  },

  postLight: function(controllerID, address) {
    var headers = {
      'content-type' : 'application/json',
      'admin' : 'true',
      'controller_id' : controllerID
    }

    var body = {
      'address' : address
    }

    return this.postHelper('/lights', headers, body).then(function(body) {
      return new Promise(function(resolve, reject) {
        resolve(body.light);
      });
    });
  },

  postHelper: function(route, headers, body) {
    return new Promise(function(resolve, reject) {
      request({
        uri: routeAPI + route,
        method: 'POST',
        headers: headers,
        json: body
      }, function(error, response, body) {
        resolve(body);
      });
    });
  }
};
