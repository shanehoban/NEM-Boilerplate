var Sequelize = require('sequelize');

// Create a MySQL datbase and enter the name of your database here
var DB_NAME = 'nem-boilerplate' || '<YOUR DB NAME>';

// create a sequelize instance with our local postgres database information.
var sequelize = new Sequelize('mysql://root@localhost:3306/' + DB_NAME, {
  define: {
    // allow emojis
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
});

// We do this so we don't have to reinclude sequelize all over the place
var db = {};
    db.Sequelize = Sequelize;
    db.sequelize = sequelize;
    // do this for each models that we have
    db.users = require('./models/user')(sequelize, Sequelize);

module.exports = db;
