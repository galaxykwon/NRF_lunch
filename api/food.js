const fetch = require('node-fetch');

export default async function handler(req, res) {
  const NAVER_ID = 'Id2KWzmixu2C7UpDpkao';
  const NAVER_SECRET = 'd4sshbGFPj';
  const KAKAO_KEY = 'ab621003638d493826e9676ee16f6fb9'; // 발급받으신 REST API 키를 입력하세요.

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
    // 1. 단골집 개별 검색 (카카오)
    const vipRequests = MY_VIP_STORES.map(name => 
      fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(name)}&size=1`, {
        headers: { 'Authorization': `KakaoAK ${KAKAO_KEY}` }
      }).then(r => r.json()).catch(() => ({ documents: [] }))
    );

    // 2. 일반 동네 검색 (네이버)
    const naverRequests = locations.map(loc => 
      fetch(`https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent('대전 유성구 ' + loc + ' 맛집')}&display=15`, {
        headers: { 'X-Naver-Client-Id': NAVER_ID, 'X-Naver-Client-Secret': NAVER_SECRET }
      }).then(r => r.json()).catch(() => ({ items: [] }))
    );

    const allResults = await Promise.all([...vipRequests, ...naverRequests]);
    
    let allItems = [];
    allResults.forEach(data => {
      if (data.documents) { // 카카오 데이터
        data.documents.forEach(item => {
          allItems.push({ name: item.place_name, address: item.road_address_name || item.address_name, category: item.category_name });
        });
      } else if (data.items) { // 네이버 데이터
        data.items.forEach(item => {
          allItems.push({ name: item.title.replace(/<[^>]*>?/gm, ''), address: item.roadAddress || item.address, category: item.category });
        });
      }
    });

    const uniqueItems = Array.from(new Map(allItems.map(item => [item.name.replace(/\s/g, ''), item])).values());
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ items: uniqueItems });
  } catch (error) {
    res.status(500).json({ error: '데이터 병합 실패' });
  }
}
