// /api/birdeye.js
export default async function handler(req, res) {
  // --- Handle CORS for TokenDock ---
  res.setHeader('Access-Control-Allow-Origin', 'https://www.tokendock.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // ✅ NEW: extract extra query params for chart support
  const { token, path, chain = 'solana', address, type = '1h', currency = 'usd' } = req.query;

  try {
    let url;

    // ✅ NEW: handle chart requests (OHLCV)
if (path && path.includes('/ohlcv')) {
  const { time_from, time_to, ui_amount_mode = "raw" } = req.query;
  const params = new URLSearchParams({
    chain,
    address,
    type,
    currency,
    ui_amount_mode,
  });
  if (time_from) params.set("time_from", time_from);
  if (time_to) params.set("time_to", time_to);

  url = `https://public-api.birdeye.so${path}?${params.toString()}`;
}

    // 🟢 EXISTING: default token overview logic (kept exactly as-is)
    else {
      const tokenAddress =
        !token || token.toLowerCase() === 'sol'
          ? 'So11111111111111111111111111111111111111112'
          : token;

      url = `https://public-api.birdeye.so/defi/token_overview?address=${tokenAddress}&ui_amount_mode=scaled`;
    }

    // existing fetch logic, unchanged
    const birdeyeRes = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'X-Chain': 'solana',
        'X-API-KEY': process.env.BIRDEYE_KEY,
      },
    });

    const data = await birdeyeRes.json();
    return res.status(200).json(data);
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: 'Birdeye fetch failed', error: err.message });
  }
}
