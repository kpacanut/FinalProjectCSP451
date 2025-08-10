module.exports = async function (context, myTimer) {
  const cid = `cid-${Date.now().toString(36)}`;

  const invBase = process.env.API_URL_INVENTORY || "http://4.248.29.93:5001";
  const prodBase = process.env.API_URL_PRODUCT   || "http://4.248.29.93:5002";
  const apiKey   = process.env.API_KEY          || "dev-key-001";

  const headers = { "x-api-key": apiKey };

  const results = { cid, when: new Date().toISOString(), inventory: null, product: null };

  try {
    const inv = await fetch(`${invBase}/health`, { headers });
    results.inventory = { ok: inv.ok, status: inv.status };
  } catch (e) {
    results.inventory = { ok: false, error: e.message };
  }

  try {
    const prod = await fetch(`${prodBase}/health`);
    results.product = { ok: prod.ok, status: prod.status };
  } catch (e) {
    results.product = { ok: false, error: e.message };
  }

  // Log a concise summary + a verbose payload
  context.log(`Timer summary [${cid}] inv:${results.inventory?.status ?? "err"} prod:${results.product?.status ?? "err"}`);
  context.log(JSON.stringify({ type: "timer-summary", ...results }));
};
