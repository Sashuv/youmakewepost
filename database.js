const mysql = require("mysql");

var connection = mysql.createPool({
  host: "us-cdbr-east-03.cleardb.com",
  user: "b479a106d5ec88",
  password: "d736a1e5",
  database: "heroku_0434217c748bf69"
});

module.exports = connection;