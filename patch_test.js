const http = require('http');

const data = JSON.stringify({
  fields: { title: "jsadfhsad sdag dsagag", description: "Test curl desc" },
  items: [],
  is_active: true
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/sections/21cd04a1-a7f2-4999-bcfa-0e2bdaa4e0bd',
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('Response:', res.statusCode, body));
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
