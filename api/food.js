const fetch = require('node-fetch');

export default async function handler(req, res) {
  const keyword = req.query.keyword || '대전 유성구 연구단지 맛집';
  const CLIENT_ID = 'Id2KWzmixu2C7UpDpkao';
  const CLIENT_SECRET = 'd4sshbGFPj';

  try {
    // 주소를 명확히 50개로 고정
    const apiUrl = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(keyword)}&display=50&sort=comment`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-Naver-Client-Id': CLIENT_ID,
        'X-Naver-Client-Secret': CLIENT_SECRET
      }
    });

    const data = await response.json();
    // 데이터가 50개인지 강제로 확인하는 로그 (Vercel Log에서 확인 가능)
    console.log("Fetched items count:", data.items ? data.items.length : 0);
    
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'API Error' });
  }
}
