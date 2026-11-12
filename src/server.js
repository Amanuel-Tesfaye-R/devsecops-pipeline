const { Pool } = require('pg');
const { createApp } = require('./app');

const port = Number(process.env.PORT) || 4000;
const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

const app = createApp({ pool });

app.listen(port, () => {
  console.log(`ShopCart API listening on port ${port}`);
});
