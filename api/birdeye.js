// /api/birdeye.js
export default async function handler(req, res) {
  // --- Handle CORS for TokenDock ---
  res.setHeader('Access-Control-Allow-Origin', 'https://www.tokendock.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { token } = req.query;

  // default to SOL if none provided or if token=sol
  const tokenAddress =
    !token || token.toLowerCase() === 'sol'
      ? 'So11111111111111111111111111111111111111112'
      : token;

  const url = `https://public-api.birdeye.so/defi/token_overview?address=${tokenAddress}&ui_amount_mode=scaled`;

  try {
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