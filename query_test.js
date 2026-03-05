const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'urbanpixora',
  password: 'admin',
  port: 5432,
});
client.connect().then(async () => {
  const res = await client.query("SELECT id, fields FROM sections WHERE id = '21cd04a1-a7f2-4999-bcfa-0e2bdaa4e0bd'");
  console.log(res.rows);
  await client.end();
}).catch(console.error);
