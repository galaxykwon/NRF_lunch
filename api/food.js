const fetch = require('node-fetch');

export default async function handler(req, res) {
  const NAVER_ID = 'Id2KWzmixu2C7UpDpkao';
  const NAVER_SECRET = 'd4sshbGFPj';

  // 1. 사용자 지정 단골 리스트 (이름, 지역, 카테고리, 가격을 직접 지정)
  const MUST_HAVE = [
    { name: '팔복집', address: '신성동', category: '한식', price: 9000 },
    { name: '천리집', address: '신성동', category: '한식', price: 9000 },
    { name: '낭랑', address: '신성동', category: '중식', price: 9000 },
    { name: '서천해물칼국수', address: '신성동', category: '한식', price: 9000 },
    { name: '영희네집밥', address: '신성동', category: '한식', price: 8000 },
    { name: '한식뷔페', address: '신성동', category: '한식', price: 8000 },
    { name: '고모네', address: '신성동', category: '한식', price: 9000 },
    { name: '오씨칼국수', address: '도룡동', category: '한식', price: 9000 },
    { name: '유성불백', address: '도룡동', category: '한식', price: 11000 },
    { name: '숨', address: '죽동', category: '일식', price: 15000 },
    { name: '잇마이타이', address: '죽동', category: '양식', price: 13000 },
    { name: '아자스', address: '죽동', category: '일식', price: 15000 },
    { name: '곱창군', address: '죽동', category: '한식', price: 25000 },
    { name: '오한순손수제비', address: '죽동', category: '한식', price: 11000 },
    { name: '키우키우', address: '죽동', category: '양식', price: 16000 },
    { name: '토시살롱', address: '죽동', category: '한식', price: 18000 },
    { name: '도우모', address: '죽동', category: '일식', price: 20000 },
    { name: '행포케', address: '죽동', category: '기타', price: 11000 },
    { name: '귀빈돌솥밥', address: '만년동', category: '한식', price: 15000 },
    { name: '일등석갈비', address: '만년동', category: '한식', price: 18000 },
    { name: '한희수개성만두', address: '화암동', category: '한식', price: 10000 },
    { name: '알텐데', address: '봉명동', category: '양식', price: 22000 },
    { name: '스바라시라멘', address: '봉명동', category: '일식', price: 10000 },
    { name: '구들마루', address: '봉명동', category: '한식', price: 12000 },
    { name: '버무리', address: '봉명동', category: '분식', price: 7000 },
    { name: '갓포호산', address: '봉명동', category: '일식', price: 45000 },
    { name: '워낭명가', address: '봉명동', category: '한식', price: 35000 },
    { name: '버기즈', address: '어은동', category: '양식', price: 11000 },
    { name: '퍼블릭마켓', address: '어은동', category: '기타', price: 15000 },
    { name: '달구지막창', address: '어은동', category: '한식', price: 15000 },
    { name: '신가네매운떡볶이', address: '궁동', category: '분식', price: 6000 },
    { name: '초원양꼬치', address: '궁동', category: '기타', price: 18000 },
    { name: '수정자갈치꼼장어', address: '궁동', category: '한식', price: 15000 },
    { name: '코니스', address: '궁동', category: '양식', price: 25000 },
    { name: '길선인', address: '궁동', category: '중식', price: 8000 },
    { name: '월미당', address: '궁동', category: '기타', price: 11000 },
    { name: '노은칼국수', address: '노은동', category: '한식', price: 8000 },
    { name: '연스시', address: '노은동', category: '일식', price: 18000 },
    { name: '참바지락칼국수', address: '노은동', category: '한식', price: 9000 },
    { name: '겐로쿠우동', address: '반석동', category: '일식', price: 10000 },
    { name: '한닭발', address: '반석동', category: '한식', price: 15000 },
    { name: '스시웨이', address: '반석동', category: '일식', price: 22000 },
    { name: '더바삭', address: '반석동', category: '일식', price: 11000 },
    { name: '피제리아다알리', address: '반석동', category: '양식', price: 20000 },
    { name: '소소하지만굉장해', address: '신성동', category: '일식', price: 13000 },
    { name: '토모카츠', address: '신성동', category: '일식', price: 13000 },
    { name: '정돈', address: '둔산동', category: '일식', price: 16000 },
    { name: '유메', address: '서대전', category: '일식', price: 13000 },
    { name: '으노카츠', address: '만년동', category: '일식', price: 12000 },
    { name: '븟스시', address: '신성동', category: '일식', price: 20000 },
    { name: '안도스시', address: '죽동', category: '일식', price: 25000 },
    { name: '쿠로텐', address: '신성동', category: '일식', price: 12000 },
    { name: '마쯔미라멘', address: '어은동', category: '일식', price: 10000 },
    { name: '진쇼우이', address: '반석동', category: '일식', price: 12000 },
    { name: '신촌설렁탕', address: '만년동', category: '한식', price: 11000 },
    { name: '박소현 나주곰탕', address: '신성동', category: '한식', price: 11000 },
    { name: '신성어죽', address: '자운동', category: '한식', price: 9000 },
    { name: '장한수 귀성본가', address: '자운동', category: '한식', price: 12000 },
    { name: '돌돌해', address: '자운동', category: '기타', price: 25000 },
    { name: '카페85도', address: '신성동', category: '기타', price: 5000 },
    { name: '영칼로리포케', address: '신성동', category: '기타', price: 12000 }
  ];

  const locations = ['신성동', '도룡동', '죽동', '전민동', '어은동', '궁동', '만년동', '노은동', '반석동'];

  try {
    const naverRequests = locations.map(loc => 
      fetch(`https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent('대전 유성구 ' + loc + ' 맛집')}&display=20`, {
        headers: { 'X-Naver-Client-Id': NAVER_ID, 'X-Naver-Client-Secret': NAVER_SECRET }
      }).then(r => r.json()).catch(() => ({ items: [] }))
    );

    const results = await Promise.all(naverRequests);
    let allItems = [];
    
    // 단골 리스트 삽입
    MUST_HAVE.forEach(item => allItems.push(item));

    // API 실시간 데이터 삽입
    results.forEach(data => {
      if (data && data.items) {
        data.items.forEach(item => {
          allItems.push({
            name: item.title.replace(/<[^>]*>?/gm, ''),
            address: item.roadAddress || item.address,
            category: item.category
          });
        });
      }
    });

    // 중복 제거 및 가격 책정 로직
    const uniqueMap = new Map();
    allItems.forEach(item => {
      const key = item.name.replace(/\s/g, '');
      if (!uniqueMap.has(key)) {
        if (!item.price) { // 가격이 없는 API 데이터만 추정치 부여
          const cat = item.category || "";
          const name = item.name;
          if (['한우','소고기','참치','회','스시','오마카세','스테이크','석갈비'].some(w => name.includes(w) || cat.includes(w))) item.price = 35000;
          else if (['파스타','피자','태국','아시아'].some(w => cat.includes(w))) item.price = 15000;
          else if (['국밥','순대','찌개','백반','한식','분식','떡볶이','칼국수','국수'].some(w => name.includes(w) || cat.includes(w))) item.price = 9000;
          else item.price = 12500;
        }
        uniqueMap.set(key, item);
      }
    });

    // 최종 결과 랜덤하게 섞기
    const finalItems = Array.from(uniqueMap.values()).sort(() => Math.random() - 0.5);

    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).json({ items: finalItems });
  } catch (error) {
    res.status(500).json({ error: '서버 오류' });
  }
}
