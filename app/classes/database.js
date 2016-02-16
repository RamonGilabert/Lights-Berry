/* Database initializer */

module.exports = function(directory) {

  var database = {
    client: 'pg',
    connection: {
      user     : 'postgres',
      password : 'postgres',
      database : 'postgres'
    }
  };

  // TODO: In Linux the connection is the following:
  // connection: directory,
  // searchPath: 'knex, public'

  var knex = require('knex')(database);
  var bookshelf = require('bookshelf')(knex);

  return bookshelf;
};
