const path = require('path');

module.exports = {
development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, 'src', 'database', 'database.db')
    },
    pool: {
      afterCreate: (conection, callback) => conection.run('PRAGMA foreign_keys = ON', callback)

      //PRAGMA foreign_keys = ON -> comando para habilitar no SQlite a funcionalidade de delete em cascata;
    },
    migrations: {
      directory: path.resolve(__dirname, 'src', 'database', 'knex', 'migrations')
    }, 
    useNullAsDefault: true,
  },
};