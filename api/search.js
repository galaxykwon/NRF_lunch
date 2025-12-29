const fetch = require('node-fetch');

export default async function handler(req, res) {
  // 1. 검색어 가져오기 (기본값: 대전 연구단지 맛집)
  const query = req.query.keyword || '대전 연구단지 맛집';
  
  // 2. 네이버 API 설정 (본인의 ID/Secret 입력 필수)
  const CLIENT_ID = 'Id2KWzmixu2C7UpDpkao';
  const CLIENT_SECRET = 'd4sshbGFPj';

  try {
    // 3. 네이버 서버로 요청 보내기
    const apiUrl = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query)}&display=5&sort=comment`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'X-Naver-Client-Id': CLIENT_ID,
        'X-Naver-Client-Secret': CLIENT_SECRET
      }
    });

    const data = await response.json();

    // 4. 결과를 브라우저에게 돌려주기 (성공)
    res.status(200).json(data);
  } catch (error) {
    // 5. 에러 발생 시
    res.status(500).json({ error: 'API 호출 실패' });
  }
}
