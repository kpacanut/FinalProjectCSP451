module.exports = async function (context, req) {
  const API_KEY = process.env.API_KEY || 'dev-key-001';
  const supplied = req.headers['x-api-key'] || req.query['x-api-key'];

  if (API_KEY && supplied !== API_KEY) {
    context.res = { status: 401, body: { ok: false, error: 'invalid api key' } };
    return;
  }

  const body = req.body || {};
  const productId = body.productId || req.query.productId;
  const name = body.name || req.query.name || '';
  const stock = Number(body.stock ?? req.query.stock ?? NaN);
  const correlationId = body.correlationId || `cid-${Date.now().toString(36)}`;

  if (!productId || Number.isNaN(stock)) {
    context.res = { status: 400, body: { ok: false, error: 'productId and stock required' } };
    return;
  }

  const msg = { productId, name, stock, correlationId };
  context.bindings.outMsg = JSON.stringify(msg); // goes to "retailqueue"

  context.res = { status: 202, body: { ok: true, enqueued: true, msg } };
};
