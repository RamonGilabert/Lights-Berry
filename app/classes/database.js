/* Database initializer */

module.exports = function(directory) {

  var database = {
    client: 'pg',
    connection: directory,
    searchPath: 'knex, public'
  };

  // TODO: In Linux the connection is the following:
  // connection: {
  //   user     : 'postgres',
  //   password : 'postgres',
  //   database : 'postgres'
  // }

  var knex = require('knex')(database);
  var bookshelf = require('bookshelf')(knex);

  return bookshelf;
};
