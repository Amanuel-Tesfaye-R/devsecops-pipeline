const { Pool } = require('pg');

const defaultPool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

module.exports = { defaultPool, Pool };
