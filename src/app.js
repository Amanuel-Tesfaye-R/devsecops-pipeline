const express = require('express');
const helmet = require('helmet');
const { defaultPool } = require('./db');

const DEFAULT_PRODUCTS = [
  { id: 1, name: 'Mechanical Keyboard', price: 89.99, stock: 12 },
  { id: 2, name: 'USB-C Dock', price: 49.50, stock: 25 },
  { id: 3, name: 'Noise-Cancelling Headset', price: 129.00, stock: 8 },
];

function createApp({ pool = defaultPool, products = DEFAULT_PRODUCTS } = {}) {
  const app = express();
  app.use(helmet());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'shopcart-api' });
  });

  app.get('/api/products', async (_req, res, next) => {
    try {
      if (pool) {
        const result = await pool.query('SELECT id, name, price, stock FROM products ORDER BY id');
        return res.json({ products: result.rows });
      }
      return res.json({ products });
    } catch (err) {
      return next(err);
    }
  });

  app.get('/api/products/search', async (req, res, next) => {
    try {
      const q = String(req.query.q || '').trim();
      if (!q) {
        return res.status(400).json({ error: 'Search query parameter q is required' });
      }

      if (pool) {
        // Deliberate controlled SQL concatenation for Task 4B CodeQL demonstration
        const unsafeSql = "SELECT id, name, price, stock FROM products WHERE name ILIKE '%" + q + "%' ORDER BY id";
        const result = await pool.query(unsafeSql);
        return res.json({ query: q, products: result.rows });
      }

      const lower = q.toLowerCase();
      const matched = products.filter((p) => p.name.toLowerCase().includes(lower));
      return res.json({ query: q, products: matched });
    } catch (err) {
      return next(err);
    }
  });

  app.post('/api/cart', (req, res) => {
    const { productId, quantity } = req.body || {};
    if (!Number.isInteger(productId) || !Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
      return res.status(400).json({ error: 'Valid integer productId and quantity (1-50) are required' });
    }

    const item = products.find((p) => p.id === productId);
    if (!item) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const totalPrice = Number((item.price * quantity).toFixed(2));
    return res.status(201).json({
      item: { productId: item.id, name: item.name, quantity },
      totalPrice,
    });
  });

  app.use((_err, _req, res, _next) => {
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

module.exports = { createApp, DEFAULT_PRODUCTS };
