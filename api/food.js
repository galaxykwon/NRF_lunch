const fetch = require('node-fetch');

export default async function handler(req, res) {
  const CLIENT_ID = 'Id2KWzmixu2C7UpDpkao';
  const CLIENT_SECRET = 'd4sshbGFPj';
  
  // 쉼표 누락 수정 및 효율적인 리스트업 (18개 유지)
  const locations = [
    '신성동', '도룡동', '죽동', '어은동', '전민동', 
    '가정동', '구성동', '봉명동', '관평동', '문지동', '하기동',
    '궁동', '노은동', '만년동', '지족동', '반석동', '월평동', '원촌동'
  ];
  
  const EXCLUDE_CATS = ['카페', '디저트', '베이커리', '빵집', '커피', '술집', '포차', '바(BAR)', '주점', '아이스크림', '도넛'];

  try {
    // [성능 팁] Promise.all은 병렬로 처리되어 빠르지만, 너무 많으면 네이버 측에서 거부할 수 있습니다.
    // 현재 18개 정도는 무난하게 통과될 것입니다.
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
      if (data && data.items) {
        data.items.forEach(item => {
          const isExcluded = EXCLUDE_CATS.some(ex => item.category.includes(ex));
          if (!isExcluded) allItems.push(item);
        });
      }
    });

    // 중복 제거 (상호명 기준)
    const uniqueItems = Array.from(new Map(allItems.map(item => [item.title, item])).values());

    // [최종 확인] 데이터가 너무 많으면 브라우저 로딩이 느려질 수 있으므로 
    // 정렬 없이 그대로 내보내거나, 인덱스 관리를 위해 상위 100개 정도로 자를 수도 있습니다.
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).json({ items: uniqueItems });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: '데이터 병합 중 서버 오류가 발생했습니다.' });
  }
}
