/* Request manager */

var request = require('request');
var routeAPI = 'https://lights-backend.herokuapp.com';

module.exports = {

  request: request,
  routeAPI: routeAPI,

  postController: function() {
    var headers = {
      'content-type': 'application/json',
      'admin': 'true'
    }

    return this.postHelper('/controllers', headers).then(function(body) {
      return new Promise(function(resolve, reject) {
        resolve(body.controller);
      });
    });
  },

  postLight: function(controllerID) {
    var headers = {
      'content-type': 'application/json',
      'admin': 'true',
      'controller_id' : controllerID
    }

    return this.postHelper('/lights', headers).then(function(body) {
      return new Promise(function(resolve, reject) {
        resolve(JSON.parse(body).light);
      });
    });
  },

  postHelper: function(route, headers, body) {
    return new Promise(function(resolve, reject) {
      request({
        uri: routeAPI + route,
        method: 'POST',
        headers: headers
      }, function(error, response, body) {
        resolve(body);
      });
    });
  }
};
