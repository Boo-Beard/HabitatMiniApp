export default async function handler(req, res) {
  const token = req.query.token;
  const url = `https://public-api.birdeye.so/defi/token_overview?address=${token}&ui_amount_mode=scaled`;

  const birdeyeRes = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'X-Chain': 'solana',
      'X-API-KEY': process.env.BIRDEYE_KEY
    }
  });

  const data = await birdeyeRes.json();
  res.status(200).json(data);
}
