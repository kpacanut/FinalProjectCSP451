// inventory-api/index.cjs
const express = require('express');
const cors = require('cors');
const { QueueClient } = require('@azure/storage-queue');

const app = express();

/* ---------- core middleware ---------- */
app.use(express.json());

// CORS: allow browser preflight (OPTIONS) and custom x-api-key header
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-key'],
}));
app.options('*', cors()); // handle all OPTIONS preflights

/* ---------- env ---------- */
const PORT = process.env.PORT || 5001;
const API_KEY = process.env.API_KEY || 'dev-key-001';
const QUEUE_NAME = process.env.QUEUE_NAME || 'retailqueue';
const STORAGE_CONNECTION_STRING = process.env.STORAGE_CONNECTION_STRING || '';

/* ---------- auth gate for routes that require key ---------- */
app.use((req, res, next) => {
  // only protect non-GET or anything that posts/changes state
  if (req.method === 'GET' && req.path === '/health') return next();
  const hdr = req.headers['x-api-key'];
  if (hdr && hdr === API_KEY) return next();
  return res.status(401).json({ ok: false, error: 'invalid api key' });
});

/* ---------- queue client (lazy) ---------- */
let queue = null;
if (STORAGE_CONNECTION_STRING) {
  try {
    queue = new QueueClient(STORAGE_CONNECTION_STRING, QUEUE_NAME);
  } catch (e) {
    console.error('Queue init error:', e.message);
  }
}

/* ---------- routes ---------- */
app.get('/health', (req, res) => {
  // no api key required here for easy probes
  res.json({ ok: true });
});

app.post('/update-stock', async (req, res) => {
  try {
    const { productId, qty, correlationId } = req.body || {};
    if (!productId || qty == null) {
      return res.status(400).json({ ok: false, error: 'productId & qty required' });
    }

    // push a message to queue if configured; otherwise just ack
    if (queue) {
      const msg = {
        productId,
        qty,
        correlationId: correlationId || `web-${Date.now()}`,
      };
      await queue.sendMessage(Buffer.from(JSON.stringify(msg)).toString('base64'));
      return res.json({ ok: true, enqueued: true });
    }

    // no queue configured—still succeed so UI can continue
    return res.json({ ok: true, enqueued: false, note: 'no queue configured' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: 'server error' });
  }
});

/* ---------- start ---------- */
app.listen(PORT, () => {
  console.log(`inventory-api listening on ${PORT}`);
});
