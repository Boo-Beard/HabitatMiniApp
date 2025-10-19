export default async function handler(req, res) {
  // --- Handle CORS ---
  res.setHeader('Access-Control-Allow-Origin', 'https://www.tokendock.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // Handle preflight requests quickly
    return res.status(200).end();
  }

  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ success: false, message: "Missing token address" });
  }

  const url = `https://public-api.birdeye.so/defi/token_overview?address=${token}&ui_amount_mode=scaled`;

  try {
    const birdeyeRes = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'X-Chain': 'solana',
        'X-API-KEY': process.env.BIRDEYE_KEY
      }
    });

    const data = await birdeyeRes.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Birdeye fetch failed", error: err.message });
  }
}
