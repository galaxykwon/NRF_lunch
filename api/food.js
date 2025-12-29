const fetch = require('node-fetch');

export default async function handler(req, res) {
  const CLIENT_ID = 'Id2KWzmixu2C7UpDpkao';
  const CLIENT_SECRET = 'd4sshbGFPj';
  
  // 데이터 수집은 더 넓게! (13개 지역)
  const locations = [
    '신성동', '도룡동', '죽동', '어은동', '전민동', 
    '가정동', '구성동', '봉명동', '상대동', '관평동', 
    '장대동', '궁동', '노은동', '만년동', '지족동', '반석동'
  ];
  
  try {
    const requests = locations.map(loc => {
      const query = `대전 유성구 ${loc} 맛집`;
      const apiUrl = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query)}&display=10&sort=comment`;
      return fetch(apiUrl, {
        headers: { 'X-Naver-Client-Id': CLIENT_ID, 'X-Naver-Client-Secret': CLIENT_SECRET }
      }).then(r => r.json());
    });

    const results = await Promise.all(requests);
    
    let allItems = [];
    results.forEach(data => {
      if (data.items) allItems = [...allItems, ...data.items];
    });

    // 중복 제거
    const uniqueItems = Array.from(new Map(allItems.map(item => [item.title, item])).values());

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ items: uniqueItems });
  } catch (error) {
    res.status(500).json({ error: '데이터 병합 실패' });
  }
}
