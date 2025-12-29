const fetch = require('node-fetch');

export default async function handler(req, res) {
  const NAVER_ID = 'Id2KWzmixu2C7UpDpkao';
  const NAVER_SECRET = 'd4sshbGFPj';
  // 키 앞에 KakaoAK 문구가 붙으므로, 아래 변수에는 키값만 넣으시면 됩니다.
  const KAKAO_KEY = 'ab621003638d493826e9676ee16f6fb9'; 

  const locations = [
    '신성동', '도룡동', '죽동', '어은동', '전민동', '가정동', 
    '문지동', '하기동', '궁동', '노은동', '만년동', '지족동', '반석동', '월평동', '원촌동'
  ];

  const MY_VIP_STORES = [
    '신성동 팔복집', '신성동 낭랑', '신성동 천리집', '신성동 서천해물칼국수', '신성동 고모네', '신성동 한식뷔페', '신성동 영희네집밥',
    '도룡동 오씨칼국수', '도룡동 유성불백', '죽동 숨', '죽동 잇마이타이', '죽동 아자스', '죽동 곱창군', '죽동 오한순손수제비',
    '죽동 키우키우', '죽동 토시살롱', '죽동 도우모', '죽동 행포케', '만년동 귀빈돌솥밥', '만년동 일등석갈비', '화암동 한희수개성만두',
    '봉명동 알텐데', '봉명동 스바라시라멘', '봉명동 구들마루', '봉명동 버무리', '봉명동 갓포호산', '봉명동 워낭명가',
    '어은동 버기즈', '어은동 퍼블릭마켓', '어은동 달구지막창', '궁동 신가네매운떡볶이', '궁동 초원양꼬치', '궁동 수정자갈치꼼장어',
    '궁동 코니스', '궁동 길선인', '궁동 월미당', '노은동 노은칼국수', '노은동 연스시', '노은동 참바지락칼국수',
    '반석동 겐로쿠우동', '반석동 한닭발', '반석동 스시웨이', '반석동 더바삭', '반석동 피제리아다알리',
    '신성동 소소하지만굉장해', '신성동 토모카츠', '둔산동 정돈', '서대전 유메', '만년동 으노카츠', '신성동 븟스시',
    '죽동 안도스시', '신성동 쿠로텐', '어은동 마쯔미라멘', '반석동 진쇼우이', '만년동 신촌설렁탕', '신성동 박소현 나주곰탕',
    '자운동 신성어죽', '자운동 장한수 귀성본가', '자운동 돌돌해', '신성동 카페85도', '신성동 영칼로리포케'
  ];

  try {
    // 1. 단골집 개별 검색 (카카오) - 맵을 돌 때 에러 처리를 강화
    const vipRequests = MY_VIP_STORES.map(name => 
      fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(name)}&size=1`, {
        headers: { 'Authorization': `KakaoAK ${KAKAO_KEY}` }
      })
      .then(async r => {
        if (!r.ok) return { documents: [] };
        return r.json();
      })
      .catch(() => ({ documents: [] }))
    );

    // 2. 일반 동네 검색 (네이버)
    const naverRequests = locations.map(loc => 
      fetch(`https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent('대전 유성구 ' + loc + ' 맛집')}&display=15`, {
        headers: { 'X-Naver-Client-Id': NAVER_ID, 'X-Naver-Client-Secret': NAVER_SECRET }
      })
      .then(async r => {
        if (!r.ok) return { items: [] };
        return r.json();
      })
      .catch(() => ({ items: [] }))
    );

    // 모든 요청을 동시에 기다림
    const allResults = await Promise.all([...vipRequests, ...naverRequests]);
    
    let allItems = [];
    allResults.forEach(data => {
      if (data && data.documents) { // 카카오 데이터 처리
        data.documents.forEach(item => {
          allItems.push({
            name: item.place_name,
            address: item.road_address_name || item.address_name,
            category: item.category_name,
            isVip: true // 단골집 표시
          });
        });
      } else if (data && data.items) { // 네이버 데이터 처리
        data.items.forEach(item => {
          const cleanName = item.title.replace(/<[^>]*>?/gm, '');
          allItems.push({
            name: cleanName,
            address: item.roadAddress || item.address,
            category: item.category,
            isVip: false
          });
        });
      }
    });

    // 중복 제거 (이름 기준)
    const uniqueMap = new Map();
    allItems.forEach(item => {
      const key = item.name.replace(/\s/g, '');
      if (!uniqueMap.has(key) || item.isVip) { // 단골집 데이터를 우선순위로 저장
        uniqueMap.set(key, item);
      }
    });

    const finalItems = Array.from(uniqueMap.values());
    
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).json({ items: finalItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '데이터를 불러오는 중 서버 오류가 발생했습니다.' });
  }
}
