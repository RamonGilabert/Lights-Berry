/* Controller model */

module.exports = function(bookshelf) {

  var Controller = bookshelf.Model.extend({
    tableName: 'controller'
  });

  return Controller;
};
