const { createApp } = require('./app');
const { defaultPool } = require('./db');

const port = Number(process.env.PORT) || 4000;
const app = createApp({ pool: defaultPool });

app.listen(port, () => {
  console.log(`ShopCart API listening on port ${port}`);
});
