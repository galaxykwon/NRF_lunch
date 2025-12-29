const fetch = require('node-fetch');

export default async function handler(req, res) {
  const CLIENT_ID = 'Id2KWzmixu2C7UpDpkao';
  const CLIENT_SECRET = 'd4sshbGFPj';
  
  const locations = [
    '신성동', '도룡동', '죽동', '어은동', '전민동', 
    '가정동', '구성동', '봉명동', '상대동', '관평동', 
    '장대동', '궁동', '노은동', '만년동', '지족동', '반석동'
  ];
  
  // [강력 필터] 제외할 단어 리스트
  const EXCLUDE_CATS = ['카페', '디저트', '베이커리', '빵집', '커피', '술집', '포차', '바(BAR)', '주점', '아이스크림', '도넛'];

  try {
    const requests = locations.map(loc => {
      const query = `대전 유성구 ${loc} 맛집`;
      const apiUrl = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query)}&display=20&sort=comment`;
      return fetch(apiUrl, {
        headers: { 'X-Naver-Client-Id': CLIENT_ID, 'X-Naver-Client-Secret': CLIENT_SECRET }
      }).then(r => r.json());
    });

    const results = await Promise.all(requests);
    
    let allItems = [];
    results.forEach(data => {
      if (data.items) {
        data.items.forEach(item => {
          // 1. 제외 카테고리 체크 (카페, 술집 등)
          const isExcluded = EXCLUDE_CATS.some(ex => item.category.includes(ex));
          
          // 2. 패스트푸드 체크 (양식 필터 오염 방지)
          const isFastFood = item.category.includes('패스트푸드') || item.category.includes('피자') || item.category.includes('치킨');

          if (!isExcluded && !isFastFood) {
            allItems.push(item);
          }
        });
      }
    });

    // 중복 제거 (상호명 기준)
    const uniqueItems = Array.from(new Map(allItems.map(item => [item.title, item])).values());

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ items: uniqueItems });
  } catch (error) {
    res.status(500).json({ error: '데이터 병합 실패' });
  }
}
