// /api/birdeye.js
export default async function handler(req, res) {
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
