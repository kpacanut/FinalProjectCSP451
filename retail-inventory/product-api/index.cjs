// product-api/index.cjs
const express = require('express');
const cors = require('cors');

const app = express();                    // <-- define app first!

app.use(cors({ origin: '*' }));
app.use(express.json());

const PORT = process.env.PORT || 5002;

// In-memory store for demo purposes
const products = new Map();

app.get('/health', (_req, res) => res.json({ ok: true }));

app.post('/products/upsert', (req, res) => {
  const { productId, name } = req.body || {};
  if (!productId || !name) {
    return res.status(400).json({ ok: false, error: 'productId & name required' });
  }
  products.set(productId, { productId, name, updatedAt: new Date().toISOString() });
  return res.json({ ok: true, product: products.get(productId) });
});

app.listen(PORT, () => {
  console.log(`product-api listening on ${PORT}`);
});
