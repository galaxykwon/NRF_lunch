const fetch = require('node-fetch');

export default async function handler(req, res) {
  const NAVER_ID = 'Id2KWzmixu2C7UpDpkao';
  const NAVER_SECRET = 'd4sshbGFPj';
  const KAKAO_KEY = 'ab621003638d493826e9676ee16f6fb9'; 

  // 1. 사용자님 제공 전체 단골 리스트 (강제 노출용)
  const MUST_HAVE = [
    { name: '팔복집', address: '신성동', category: '한식' }, { name: '낭랑', address: '신성동', category: '중식' },
    { name: '천리집', address: '신성동', category: '한식' }, { name: '서천해물칼국수', address: '신성동', category: '한식' },
    { name: '고모네', address: '신성동', category: '한식' }, { name: '한식뷔페', address: '신성동', category: '한식' },
    { name: '영희네집밥', address: '신성동', category: '한식' }, { name: '오씨칼국수', address: '도룡동', category: '한식' },
    { name: '유성불백', address: '도룡동', category: '한식' }, { name: '숨', address: '죽동', category: '일식' },
    { name: '잇마이타이', address: '죽동', category: '양식' }, { name: '아자스', address: '죽동', category: '일식' },
    { name: '곱창군', address: '죽동', category: '한식' }, { name: '오한순손수제비', address: '죽동', category: '한식' },
    { name: '키우키우', address: '죽동', category: '양식' }, { name: '토시살롱', address: '죽동', category: '한식' },
    { name: '도우모', address: '죽동', category: '일식' }, { name: '행포케', address: '죽동', category: '기타' },
    { name: '귀빈돌솥밥', address: '만년동', category: '한식' }, { name: '일등석갈비', address: '만년동', category: '한식' },
    { name: '한희수개성만두', address: '화암동', category: '한식' }, { name: '알텐데', address: '봉명동', category: '양식' },
    { name: '스바라시라멘', address: '봉명동', category: '일식' }, { name: '구들마루', address: '봉명동', category: '한식' },
    { name: '버무리', address: '봉명동', category: '분식' }, { name: '갓포호산', address: '봉명동', category: '일식' },
    { name: '워낭명가', address: '봉명동', category: '한식' }, { name: '버기즈', address: '어은동', category: '양식' },
    { name: '퍼블릭마켓', address: '어은동', category: '기타' }, { name: '달구지막창', address: '어은동', category: '한식' },
    { name: '신가네매운떡볶이', address: '궁동', category: '분식' }, { name: '초원양꼬치', address: '궁동', category: '기타' },
    { name: '수정자갈치꼼장어', address: '궁동', category: '한식' }, { name: '코니스', address: '궁동', category: '양식' },
    { name: '길선인', address: '궁동', category: '중식' }, { name: '월미당', address: '궁동', category: '기타' },
    { name: '노은칼국수', address: '노은동', category: '한식' }, { name: '연스시', address: '노은동', category: '일식' },
    { name: '참바지락칼국수', address: '노은동', category: '한식' }, { name: '겐로쿠우동', address: '반석동', category: '일식' },
    { name: '한닭발', address: '반석동', category: '한식' }, { name: '스시웨이', address: '반석동', category: '일식' },
    { name: '더바삭', address: '반석동', category: '일식' }, { name: '피제리아다알리', address: '반석동', category: '양식' },
    { name: '소소하지만굉장해', address: '신성동', category: '일식' }, { name: '토모카츠', address: '신성동', category: '일식' },
    { name: '정돈', address: '둔산동', category: '일식' }, { name: '유메', address: '서대전', category: '일식' },
    { name: '으노카츠', address: '만년동', category: '일식' }, { name: '븟스시', address: '신성동', category: '일식' },
    { name: '안도스시', address: '죽동', category: '일식' }, { name: '쿠로텐', address: '신성동', category: '일식' },
    { name: '마쯔미라멘', address: '어은동', category: '일식' }, { name: '진쇼우이', address: '반석동', category: '일식' },
    { name: '신촌설렁탕', address: '만년동', category: '한식' }, { name: '박소현 나주곰탕', address: '신성동', category: '한식' },
    { name: '신성어죽', address: '자운동', category: '한식' }, { name: '장한수 귀성본가', address: '자운동', category: '한식' },
    { name: '돌돌해', address: '자운동', category: '기타' }, { name: '카페85도', address: '신성동', category: '기타' },
    { name: '영칼로리포케', address: '신성동', category: '기타' }
  ];

  const locations = ['신성동', '도룡동', '죽동', '전민동', '관평동', '문지동'];

  try {
    // 2. 일반 동네 맛집 검색 (실시간 데이터 확보)
    const naverRequests = locations.map(loc => 
      fetch(`https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent('대전 유성구 ' + loc + ' 맛집')}&display=20`, {
        headers: { 'X-Naver-Client-Id': NAVER_ID, 'X-Naver-Client-Secret': NAVER_SECRET }
      }).then(r => r.json()).catch(() => ({ items: [] }))
    );

    const results = await Promise.all(naverRequests);
    
    let apiItems = [];
    results.forEach(data => {
      if (data && data.items) {
        data.items.forEach(item => {
          apiItems.push({
            name: item.title.replace(/<[^>]*>?/gm, ''),
            address: item.roadAddress || item.address,
            category: item.category
          });
        });
      }
    });

    // 3. 고정 리스트와 API 리스트 병합 (고정 리스트 우선순위)
    const combined = [...MUST_HAVE, ...apiItems];

    // 4. 중복 제거
    const uniqueItems = Array.from(new Map(combined.map(item => [item.name.replace(/\s/g, ''), item])).values());
    
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ items: uniqueItems });

  } catch (error) {
    res.status(500).json({ error: '서버 오류' });
  }
}
