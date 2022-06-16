const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'superuser',
  password: 'superuser',
  host: 'localhost',
  port: 5432,
  database: 'jwttutorial',
});

module.exports = pool;
