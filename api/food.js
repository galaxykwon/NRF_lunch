const fetch = require('node-fetch');

export default async function handler(req, res) {
  // 1번 단계에서 받은 Gemini API 키
  const GEMINI_API_KEY = 'AIzaSyBkyt2mgTh73Z9HS8c5AuRtURxi-_T2-Pw';
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const prompt = `
      대전광역시 유성구 연구단지(신성동, 도룡동, 죽동, 어은동, 전민동) 인근의 맛집 50개를 찾아줘.
      반드시 다음 JSON 형식으로 응답해줘. 다른 설명은 하지마.
      {
        "items": [
          {
            "name": "식당이름",
            "area": "동이름",
            "cat": "음식종류",
            "menu": "대표메뉴",
            "score": 4.5,
            "reviewCount": 120,
            "isRealTime": true
          }
        ]
      }
      별점(score)은 구글 맵의 최신 데이터를 참고해서 실수(float)로 작성해줘.
    `;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    
    // JSON 텍스트만 추출 (가끔 AI가 마크다운 형식을 섞을 때를 대비)
    const jsonString = resultText.match(/\{[\s\S]*\}/)[0];
    const finalData = JSON.parse(jsonString);

    // 별점 높은 순 정렬
    finalData.items.sort((a, b) => b.score - a.score);

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(finalData);
  } catch (error) {
    res.status(500).json({ error: 'Gemini AI 호출 실패' });
  }
}
