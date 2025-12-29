const fetch = require('node-fetch');

export default async function handler(req, res) {
  const keyword = req.query.keyword || '대전 유성구 연구단지 맛집';
  const CLIENT_ID = 'Id2KWzmixu2C7UpDpkao';
  const CLIENT_SECRET = 'd4sshbGFPj';

  try {
    // [중요] display=50 으로 수정하여 50개를 요청합니다.
    const apiUrl = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(keyword)}&display=50&sort=comment`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-Naver-Client-Id': CLIENT_ID,
        'X-Naver-Client-Secret': CLIENT_SECRET
      }
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'API 호출 실패' });
  }
}
