const { Sequelize } = require("sequelize");

// Example for a SQLite database (adjust for your needs)
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "../database.sqlite", // This is the file where SQLite stores data
});

// Example for a PostgreSQL database:
// const sequelize = new Sequelize('database', 'username', 'password', {
//   host: 'localhost',
//   dialect: 'postgres',
// });

// Example for a MySQL database:
// const sequelize = new Sequelize('database', 'username', 'password', {
//   host: 'localhost',
//   dialect: 'mysql',
// });

module.exports = sequelize;
