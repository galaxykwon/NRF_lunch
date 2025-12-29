const fetch = require('node-fetch');

export default async function handler(req, res) {
  const NAVER_ID = 'Id2KWzmixu2C7UpDpkao';
  const NAVER_SECRET = 'd4sshbGFPj';
  const KAKAO_KEY = '본인의_카카오_REST_API_키_입력'; // 발급받은 REST API 키

  // 요청하신 16개 동네 리스트
  const locations = [
    '신성동', '도룡동', '죽동', '어은동', '전민동', 
    '가정동', '관평동', '문지동', '하기동', '궁동', 
    '노은동', '만년동', '지족동', '반석동', '월평동', '원촌동'
  ];

  const EXCLUDE_CATS = ['카페', '디저트', '베이커리', '빵집', '커피', '술집', '포차', '바(BAR)', '주점', '아이스크림', '도넛'];

  try {
    // 1. 네이버 & 카카오 요청 병렬 생성
    const naverRequests = locations.map(loc => 
      fetch(`https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent('대전 유성구 ' + loc + ' 맛집')}&display=15`, {
        headers: { 'X-Naver-Client-Id': NAVER_ID, 'X-Naver-Client-Secret': NAVER_SECRET }
      }).then(r => r.ok ? r.json() : { items: [] }).catch(() => ({ items: [] }))
    );

    const kakaoRequests = locations.map(loc => 
      fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent('대전 유성구 ' + loc + ' 맛집')}&size=10`, {
        headers: { 'Authorization': `KakaoAK ${KAKAO_KEY}` }
      }).then(r => r.ok ? r.json() : { documents: [] }).catch(() => ({ documents: [] }))
    );

    // 2. 모든 요청 동시 실행 (Vercel 시간 제한 내 완료를 위해 최적화)
    const results = await Promise.all([...naverRequests, ...kakaoRequests]);
    
    let allItems = [];
    results.forEach(data => {
      if (!data) return;
      
      // 네이버 응답 처리
      if (data.items) {
        data.items.forEach(item => {
          const cleanName = item.title.replace(/<[^>]*>?/gm, '');
          if (!EXCLUDE_CATS.some(ex => item.category.includes(ex))) {
            allItems.push({ name: cleanName, address: item.roadAddress || item.address, category: item.category });
          }
        });
      }

      // 카카오 응답 처리
      if (data.documents) {
        data.documents.forEach(item => {
          if (!EXCLUDE_CATS.some(ex => item.category_name.includes(ex))) {
            allItems.push({ name: item.place_name, address: item.road_address_name || item.address_name, category: item.category_name });
          }
        });
      }
    });

    // 상호명 기준 중복 제거
    const uniqueItems = Array.from(new Map(allItems.map(item => [item.name.replace(/\s/g, ''), item])).values());

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ items: uniqueItems });

  } catch (error) {
    res.status(500).json({ error: '데이터 병합 실패' });
  }
}
