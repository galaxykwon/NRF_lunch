const fetch = require('node-fetch');

export default async function handler(req, res) {
  // GET 요청이 아니면 거절
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const keyword = req.query.keyword || '대전 연구단지 맛집';

  // 제공해주신 네이버 개발자 키 적용
  const CLIENT_ID = 'Id2KWzmixu2C7UpDpkao';
  const CLIENT_SECRET = 'd4sshbGFPj';

  try {
    // 네이버 지역 검색 API 호출 (검색어, 출력개수 5개, 관련도순)
    const apiUrl = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(keyword)}&display=5&sort=comment`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-Naver-Client-Id': CLIENT_ID,
        'X-Naver-Client-Secret': CLIENT_SECRET
      }
    });

    if (!response.ok) {
      throw new Error(`Naver API Error: ${response.status}`);
    }

    const data = await response.json();
    
    // 성공적으로 데이터를 브라우저로 반환
    res.status(200).json(data);

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
