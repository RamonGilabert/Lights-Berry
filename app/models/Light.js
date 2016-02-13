/* Lights model */

module.exports = function(bookshelf) {

  return Light = bookshelf.Model.extend({
    tableName: 'lights'
  });
};
