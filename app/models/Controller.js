/* Controller model */

module.exports = function(bookshelf) {

  return Controller = bookshelf.Model.extend({
    tableName: 'controller'
  });
};
