var mysql = require('mysql2');
const pool = mysql.createPool({
    connectionLimit: 5,
    user: "root",
    database: "tasks",
    password: "",
    host: 'localhost',
  });

  module.exports = pool;