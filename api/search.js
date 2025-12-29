const fetch = require('node-fetch');

export default async function handler(req, res) {
  // 브라우저에서 보낸 검색어 또는 기본값
  const keyword = req.query.keyword || '대전 유성구 연구단지 맛집';
  
  const CLIENT_ID = 'Id2KWzmixu2C7UpDpkao';
  const CLIENT_SECRET = 'd4sshbGFPj';

  try {
    // [핵심] display=50 설정을 확실히 넣었습니다.
    const apiUrl = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(keyword)}&display=50&sort=comment`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-Naver-Client-Id': CLIENT_ID,
        'X-Naver-Client-Secret': CLIENT_SECRET
      }
    });

    if (!response.ok) {
      throw new Error(`Naver API Status: ${response.status}`);
    }

    const data = await response.json();
    
    // Vercel 캐시를 방지하기 위해 헤더 추가
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).json(data);

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'API 호출 실패' });
  }
}
