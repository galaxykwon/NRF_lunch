const fetch = require('node-fetch');

export default async function handler(req, res) {
  const NAVER_ID = 'Id2KWzmixu2C7UpDpkao';
  const NAVER_SECRET = 'd4sshbGFPj';
  const KAKAO_KEY = '여기에_카카오_REST_API_키를_넣으세요'; // 1단계에서 복사한 키

  const locations = [
    '신성동', '도룡동', '죽동', '어은동', '전민동', 
    '가정동', '구성동', '봉명동', '관평동', '문지동', '하기동',
    '궁동', '노은동', '만년동', '지족동', '반석동', '월평동', '원촌동'
  ];

  const EXCLUDE_CATS = ['카페', '디저트', '베이커리', '빵집', '커피', '술집', '포차', '바(BAR)', '주점', '아이스크림', '도넛'];

  try {
    // --- 1. 네이버 API 요청 생성 ---
    const naverRequests = locations.map(loc => {
      const query = `대전 유성구 ${loc} 맛집`;
      return fetch(`https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query)}&display=20`, {
        headers: { 'X-Naver-Client-Id': NAVER_ID, 'X-Naver-Client-Secret': NAVER_SECRET }
      }).then(r => r.json());
    });

    // --- 2. 카카오 API 요청 생성 ---
    const kakaoRequests = locations.map(loc => {
      const query = `대전 유성구 ${loc} 맛집`;
      return fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&size=15`, {
        headers: { 'Authorization': `KakaoAK ${ab621003638d493826e9676ee16f6fb9}` }
      }).then(r => r.json());
    });

    // 모든 요청 동시 실행
    const allResults = await Promise.all([...naverRequests, ...kakaoRequests]);
    
    let allItems = [];

    allResults.forEach((data, index) => {
      if (!data) return;

      // 네이버 데이터 처리
      if (data.items) {
        data.items.forEach(item => {
          const cleanName = item.title.replace(/<[^>]*>?/gm, '');
          if (!EXCLUDE_CATS.some(ex => item.category.includes(ex))) {
            allItems.push({
                name: cleanName,
                address: item.roadAddress || item.address,
                category: item.category,
                source: 'Naver'
            });
          }
        });
      }

      // 카카오 데이터 처리
      if (data.documents) {
        data.documents.forEach(item => {
          if (!EXCLUDE_CATS.some(ex => item.category_name.includes(ex))) {
            allItems.push({
                name: item.place_name,
                address: item.road_address_name || item.address_name,
                category: item.category_name,
                source: 'Kakao'
            });
          }
        });
      }
    });

    // 상호명 기준으로 중복 제거 (네이버/카카오 양쪽에 있는 식당 하나만 남기기)
    const uniqueItems = Array.from(new Map(allItems.map(item => [item.name.replace(/\s/g, ''), item])).values());

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ items: uniqueItems });

  } catch (error) {
    res.status(500).json({ error: '데이터 병합 실패' });
  }
}
