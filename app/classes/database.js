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

  // LINUX:
  // connection: directory,
  // searchPath: 'knex, public'

  var knex = require('knex')(database);
  var bookshelf = require('bookshelf')(knex);

  return bookshelf;
};
