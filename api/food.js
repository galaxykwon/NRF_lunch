const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

export default async function handler(req, res) {
  const NAVER_ID = 'Id2KWzmixu2C7UpDpkao';
  const NAVER_SECRET = 'd4sshbGFPj';
  const KAKAO_KEY = 'ab621003638d493826e9676ee16f6fb9';
  
  const SB_URL = 'https://pbfgygmykizekzkzjrmo.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiZmd5Z215a2l6ZWt6a3pqcm1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5ODkwMzcsImV4cCI6MjA4MjU2NTAzN30.EbZbSDhDfO8IYZq1vguctih8T_7ChDGpfsubP_mhCuY';
  const supabase = createClient(SB_URL, SB_KEY);

  const MUST_HAVE = [
    { name: '국영수 떡볶이', address: '전민동', category: '분식', price: 7000, isVip: true },
    { name: '행복한우리집', address: '전민동', category: '분식', price: 9000, isVip: true },
    { name: '팔복집', address: '신성동', category: '한식', price: 9000, isVip: true },
    { name: '천리집', address: '신성동', category: '한식', price: 9000, isVip: true },
    { name: '낭랑', address: '신성동', category: '중식', price: 9000, isVip: true },
    { name: '서천해물칼국수', address: '신성동', category: '한식', price: 9000, isVip: true },
    { name: '영희네집밥', address: '신성동', category: '한식', price: 8000, isVip: true },
    { name: '한식뷔페', address: '신성동', category: '한식', price: 8000, isVip: true },
    { name: '고모네', address: '신성동', category: '한식', price: 9000, isVip: true },
    { name: '유성불백', address: '도룡동', category: '한식', price: 11000, isVip: true },
    { name: '숨', address: '죽동', category: '일식', price: 15000, isVip: true },
    { name: '잇마이타이', address: '죽동', category: '기타', price: 13000, isVip: true },
    { name: '아자스', address: '죽동', category: '일식', price: 15000, isVip: true },
    { name: '스시화', address: '신성동', category: '일식', price: 15000, isVip: true },
    { name: '오한순손수제비', address: '죽동', category: '한식', price: 11000, isVip: true },
    { name: '키우키우', address: '죽동', category: '양식', price: 16000, isVip: true },
    { name: '토시살롱', address: '죽동', category: '한식', price: 18000, isVip: true },
    { name: '도우모', address: '죽동', category: '일식', price: 20000, isVip: true },
    { name: '행포케', address: '죽동', category: '기타', price: 11000, isVip: true },
    { name: '귀빈돌솥밥', address: '만년동', category: '한식', price: 15000, isVip: true },
    { name: '일등석갈비', address: '만년동', category: '한식', price: 18000, isVip: true },
    { name: '한희수개성만두', address: '화암동', category: '한식', price: 10000, isVip: true },
    { name: '알텐데', address: '봉명동', category: '양식', price: 22000, isVip: true },
    { name: '스바라시라멘', address: '봉명동', category: '일식', price: 10000, isVip: true },
    { name: '구들마루', address: '봉명동', category: '한식', price: 12000, isVip: true },
    { name: '버무리', address: '봉명동', category: '분식', price: 7000, isVip: true },
    { name: '갓포호산', address: '봉명동', category: '일식', price: 45000, isVip: true },
    { name: '워낭명가', address: '봉명동', category: '한식', price: 35000, isVip: true },
    { name: '버기즈', address: '어은동', category: '양식', price: 11000, isVip: true },
    { name: '퍼블릭마켓', address: '어은동', category: '기타', price: 15000, isVip: true },
    { name: '달구지막창', address: '어은동', category: '한식', price: 15000, isVip: true },
    { name: '신가네매운떡볶이', address: '궁동', category: '분식', price: 6000, isVip: true },
    { name: '초원양꼬치', address: '궁동', category: '기타', price: 18000, isVip: true },
    { name: '수정자갈치꼼장어', address: '궁동', category: '한식', price: 15000, isVip: true },
    { name: '코니스', address: '궁동', category: '양식', price: 25000, isVip: true },
    { name: '길선인', address: '궁동', category: '중식', price: 8000, isVip: true },
    { name: '월미당', address: '궁동', category: '기타', price: 11000, isVip: true },
    { name: '노은칼국수', address: '노은동', category: '한식', price: 8000, isVip: true },
    { name: '연스시', address: '노은동', category: '일식', price: 18000, isVip: true },
    { name: '참바지락칼국수', address: '노은동', category: '한식', price: 9000, isVip: true },
    { name: '겐로쿠우동', address: '반석동', category: '일식', price: 10000, isVip: true },
    { name: '한닭발', address: '반석동', category: '한식', price: 15000, isVip: true },
    { name: '스시웨이', address: '반석동', category: '일식', price: 22000, isVip: true },
    { name: '더바삭', address: '반석동', category: '일식', price: 11000, isVip: true },
    { name: '피제리아다알리', address: '반석동', category: '양식', price: 20000, isVip: true },
    { name: '수수하지만굉장해', address: '신성동', category: '일식', price: 13000, isVip: true },
    { name: '토모카츠', address: '신성동', category: '일식', price: 13000, isVip: true },
    { name: '정돈', address: '둔산동', category: '일식', price: 16000, isVip: true },
    { name: '유메', address: '서대전', category: '일식', price: 13000, isVip: true },
    { name: '으노카츠', address: '만년동', category: '일식', price: 12000, isVip: true },
    { name: '븟스시', address: '신성동', category: '일식', price: 20000, isVip: true },
    { name: '안도스시', address: '죽동', category: '일식', price: 25000, isVip: true },
    { name: '쿠로텐', address: '신성동', category: '일식', price: 12000, isVip: true },
    { name: '마쯔미라멘', address: '어은동', category: '일식', price: 10000, isVip: true },
    { name: '진쇼우이', address: '반석동', category: '일식', price: 12000, isVip: true },
    { name: '신촌설렁탕', address: '만년동', category: '한식', price: 11000, isVip: true },
    { name: '박소현 나주곰탕', address: '신성동', category: '한식', price: 11000, isVip: true },
    { name: '신성어죽', address: '자운동', category: '한식', price: 9000, isVip: true },
    { name: '장한수 귀성본가', address: '자운동', category: '한식', price: 12000, isVip: true },
    { name: '돌돌해', address: '자운동', category: '기타', price: 25000, isVip: true },
    { name: '카페85도', address: '신성동', category: '기타', price: 5000, isVip: true },
    { name: '영칼로리포케', address: '신성동', category: '기타', price: 12000, isVip: true }
  ];

  const locations = ['신성동', '도룡동', '죽동', '전민동', '어은동', '궁동', '만년동', '노은동'];

  try {
    const { data: userStores } = await supabase.from('my_stores').select('*');
    const naverRequests = locations.map(loc => 
      fetch(`https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent('대전 ' + loc + ' 맛집')}&display=15`, {
        headers: { 'X-Naver-Client-Id': NAVER_ID, 'X-Naver-Client-Secret': NAVER_SECRET }
      }).then(r => r.json()).catch(() => ({ items: [] }))
    );
    const kakaoRequests = locations.map(loc => 
      fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent('대전 ' + loc + ' 맛집')}&size=10`, {
        headers: { 'Authorization': `KakaoAK ${KAKAO_KEY}` }
      }).then(r => r.json()).catch(() => ({ documents: [] }))
    );

    const allResults = await Promise.all([...naverRequests, ...kakaoRequests]);
    let allItems = [];
    MUST_HAVE.forEach(item => allItems.push(item));
    if (userStores) userStores.forEach(s => allItems.push({ ...s, isVip: true }));

    allResults.forEach(data => {
      if (data && data.documents) {
        data.documents.forEach(item => {
          allItems.push({ name: item.place_name, address: item.road_address_name || item.address_name, category: item.category_name, isVip: false });
        });
      } else if (data && data.items) {
        data.items.forEach(item => {
          allItems.push({ name: item.title.replace(/<[^>]*>?/gm, ''), address: item.roadAddress || item.address, category: item.category, isVip: false });
        });
      }
    });

    const uniqueMap = new Map();
    allItems.forEach(item => {
      const key = item.name.replace(/\s/g, '');
      if (!uniqueMap.has(key)) {
        if (!item.price) {
          const cat = item.category || "";
          const name = item.name;
          if (['한정식', '오마카세', '코스', '한우', '소고기', '참치', '스시', '스테이크'].some(w => name.includes(w) || cat.includes(w))) item.price = 35000;
          else if (['파스타', '피자', '태국', '아시아'].some(w => cat.includes(w))) item.price = 16000;
          else if (['국밥', '순대', '찌개', '백반', '한식', '분식', '떡볶이', '칼국수'].some(w => name.includes(w) || cat.includes(w))) item.price = 9000;
          else item.price = 12500;
        }
        uniqueMap.set(key, item);
      }
    });

    const finalItems = Array.from(uniqueMap.values()).sort(() => Math.random() - 0.5);
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).json({ items: finalItems });
  } catch (error) {
    res.status(500).json({ error: '서버 오류' });
  }
}
