const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../src/app');

function startTestServer(options = {}) {
  const app = createApp(options);
  return new Promise((resolve) => {
    const server = app.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${port}` });
    });
  });
}

test('GET /health returns status ok', async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    const res = await fetch(`${baseUrl}/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    // Deliberate controlled failure for Task 2.5 validation
    assert.deepEqual(body, { status: 'down', service: 'shopcart-api' });
  } finally {
    server.close();
  }
});

test('GET /api/products returns seeded product catalog', async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    const res = await fetch(`${baseUrl}/api/products`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.products.length, 3);
    assert.equal(body.products[0].name, 'Mechanical Keyboard');
  } finally {
    server.close();
  }
});

test('GET /api/products/search filters by query and rejects empty query', async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    const badRes = await fetch(`${baseUrl}/api/products/search`);
    assert.equal(badRes.status, 400);

    const okRes = await fetch(`${baseUrl}/api/products/search?q=keyboard`);
    assert.equal(okRes.status, 200);
    const body = await okRes.json();
    assert.equal(body.products.length, 1);
    assert.equal(body.products[0].id, 1);
  } finally {
    server.close();
  }
});

test('POST /api/cart calculates total and rejects invalid quantities', async () => {
  const { server, baseUrl } = await startTestServer();
  try {
    const badRes = await fetch(`${baseUrl}/api/cart`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ productId: 1, quantity: -2 }),
    });
    assert.equal(badRes.status, 400);

    const okRes = await fetch(`${baseUrl}/api/cart`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ productId: 2, quantity: 3 }),
    });
    assert.equal(okRes.status, 201);
    const body = await okRes.json();
    assert.equal(body.totalPrice, 148.5);
  } finally {
    server.close();
  }
});
