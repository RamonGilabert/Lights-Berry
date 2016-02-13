/* Request manager */

var request = require('request');
var routeAPI = 'https://lights-backend.herokuapp.com';

module.exports = {

  request: request,
  routeAPI: routeAPI,

  postController: function() {
    var headers = {
      'admin': 'true'
    }

    return this.postHelper('/controllers', headers).then(function(body) {
      return new Promise(function(resolve, reject) {
        var body = JSON.parse(body);
        resolve(body.controller);
      });
    });
  },

  postLight: function(controllerID) {
    var headers = {
      'admin': 'true',
      'controller_id' : controllerID
    }

    var body = {
      "status": false,
      "intensity": 1,
      "red": 1,
      "green": 1,
      "blue": 1
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
