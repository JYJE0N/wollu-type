export interface WordData {
  content: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  frequency: number; // Usage frequency (1-10)
}

export const koreanWords: WordData[] = [
  // 기본 단어들 - 쉬움
  { content: '안녕', category: '인사', difficulty: 'easy', frequency: 10 },
  { content: '감사', category: '인사', difficulty: 'easy', frequency: 9 },
  { content: '사랑', category: '감정', difficulty: 'easy', frequency: 9 },
  { content: '행복', category: '감정', difficulty: 'easy', frequency: 8 },
  { content: '친구', category: '관계', difficulty: 'easy', frequency: 8 },
  { content: '가족', category: '관계', difficulty: 'easy', frequency: 8 },
  { content: '학교', category: '장소', difficulty: 'easy', frequency: 8 },
  { content: '집', category: '장소', difficulty: 'easy', frequency: 9 },
  { content: '음식', category: '생활', difficulty: 'easy', frequency: 8 },
  { content: '물', category: '생활', difficulty: 'easy', frequency: 9 },
  
  // 일상 단어들 - 보통
  { content: '컴퓨터', category: '기술', difficulty: 'medium', frequency: 7 },
  { content: '인터넷', category: '기술', difficulty: 'medium', frequency: 7 },
  { content: '전화기', category: '기술', difficulty: 'medium', frequency: 6 },
  { content: '텔레비전', category: '기술', difficulty: 'medium', frequency: 6 },
  { content: '자동차', category: '교통', difficulty: 'medium', frequency: 7 },
  { content: '지하철', category: '교통', difficulty: 'medium', frequency: 6 },
  { content: '버스', category: '교통', difficulty: 'medium', frequency: 7 },
  { content: '비행기', category: '교통', difficulty: 'medium', frequency: 5 },
  { content: '도서관', category: '장소', difficulty: 'medium', frequency: 6 },
  { content: '병원', category: '장소', difficulty: 'medium', frequency: 6 },
  
  // 업무/학습 관련 - 보통
  { content: '회사', category: '업무', difficulty: 'medium', frequency: 7 },
  { content: '직장', category: '업무', difficulty: 'medium', frequency: 6 },
  { content: '회의', category: '업무', difficulty: 'medium', frequency: 6 },
  { content: '프로젝트', category: '업무', difficulty: 'medium', frequency: 5 },
  { content: '문서', category: '업무', difficulty: 'medium', frequency: 6 },
  { content: '보고서', category: '업무', difficulty: 'medium', frequency: 5 },
  { content: '발표', category: '업무', difficulty: 'medium', frequency: 5 },
  { content: '교육', category: '학습', difficulty: 'medium', frequency: 6 },
  { content: '연수', category: '학습', difficulty: 'medium', frequency: 4 },
  { content: '시험', category: '학습', difficulty: 'medium', frequency: 6 },
  
  // 감정/추상 개념 - 어려움
  { content: '우울함', category: '감정', difficulty: 'hard', frequency: 4 },
  { content: '절망', category: '감정', difficulty: 'hard', frequency: 3 },
  { content: '환희', category: '감정', difficulty: 'hard', frequency: 3 },
  { content: '그리움', category: '감정', difficulty: 'hard', frequency: 4 },
  { content: '향수', category: '감정', difficulty: 'hard', frequency: 3 },
  { content: '철학', category: '추상', difficulty: 'hard', frequency: 4 },
  { content: '존재', category: '추상', difficulty: 'hard', frequency: 4 },
  { content: '본질', category: '추상', difficulty: 'hard', frequency: 3 },
  { content: '현상', category: '추상', difficulty: 'hard', frequency: 3 },
  { content: '의식', category: '추상', difficulty: 'hard', frequency: 4 },
  
  // 전문 용어 - 어려움
  { content: '알고리즘', category: '기술', difficulty: 'hard', frequency: 3 },
  { content: '데이터베이스', category: '기술', difficulty: 'hard', frequency: 4 },
  { content: '프로그래밍', category: '기술', difficulty: 'hard', frequency: 4 },
  { content: '네트워크', category: '기술', difficulty: 'hard', frequency: 4 },
  { content: '보안', category: '기술', difficulty: 'hard', frequency: 5 },
  { content: '암호화', category: '기술', difficulty: 'hard', frequency: 3 },
  { content: '블록체인', category: '기술', difficulty: 'hard', frequency: 2 },
  { content: '인공지능', category: '기술', difficulty: 'hard', frequency: 5 },
  { content: '머신러닝', category: '기술', difficulty: 'hard', frequency: 3 },
  { content: '빅데이터', category: '기술', difficulty: 'hard', frequency: 3 },
  
  // 특수 문자 조합이 있는 단어들
  { content: '키보드', category: '기술', difficulty: 'medium', frequency: 5 },
  { content: '마우스', category: '기술', difficulty: 'medium', frequency: 5 },
  { content: '모니터', category: '기술', difficulty: 'medium', frequency: 5 },
  { content: '스피커', category: '기술', difficulty: 'medium', frequency: 4 },
  { content: '프린터', category: '기술', difficulty: 'medium', frequency: 4 },
  { content: '스캐너', category: '기술', difficulty: 'medium', frequency: 3 },
  
  // 약지/새끼손가락 연습용
  { content: '라라라', category: '연습', difficulty: 'easy', frequency: 1 },
  { content: '사사사', category: '연습', difficulty: 'easy', frequency: 1 },
  { content: '파파파', category: '연습', difficulty: 'easy', frequency: 1 },
  { content: '차차차', category: '연습', difficulty: 'easy', frequency: 1 },
  { content: '하하하', category: '연습', difficulty: 'easy', frequency: 1 },
];

// 카테고리별 단어 필터링
export const getKoreanWordsByCategory = (category: string) => {
  return koreanWords.filter(word => word.category === category);
};

// 난이도별 단어 필터링
export const getKoreanWordsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
  return koreanWords.filter(word => word.difficulty === difficulty);
};

// 빈도수별 단어 필터링
export const getKoreanWordsByFrequency = (minFreq: number) => {
  return koreanWords.filter(word => word.frequency >= minFreq);
};

// 무작위 단어 선택
export const getRandomKoreanWords = (count: number, options?: {
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  minFrequency?: number;
}) => {
  let filteredWords = [...koreanWords];
  
  if (options?.category) {
    filteredWords = filteredWords.filter(word => word.category === options.category);
  }
  
  if (options?.difficulty) {
    filteredWords = filteredWords.filter(word => word.difficulty === options.difficulty);
  }
  
  if (options?.minFrequency) {
    filteredWords = filteredWords.filter(word => word.frequency >= options.minFrequency);
  }
  
  const shuffled = [...filteredWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// AI 조언에 따른 맞춤 단어 추천
export const getTargetedKoreanWords = (weakFingers: string[]) => {
  const fingerWordMap: { [key: string]: string[] } = {
    '왼손 새끼': ['사과', '소금', '시간', '세상', '새로운', '성장', '수업', '소리'],
    '왼손 약지': ['아침', '안녕', '알림', '약속', '어제', '오늘', '우리', '이제'],
    '왼손 중지': ['드디어', '다음', '대화', '도서관', '데이터', '디자인', '동물', '달'],
    '왼손 검지': ['방법', '바로', '부모님', '비밀', '빨리', '변화', '병원', '별'],
    '오른손 검지': ['나무', '내일', '누구', '느낌', '년도', '남자', '녹색', '놀이'],
    '오른손 중지': ['인간', '이야기', '일상', '의미', '음악', '영화', '여행', '열정'],
    '오른손 약지': ['라디오', '로봇', '리더', '레시피', '랩탑', '로그인', '러닝', '로직'],
    '오른손 새끼': ['하늘', '행복', '희망', '한국', '혁신', '현실', '협력', '화면']
  };
  
  const targetWords: string[] = [];
  
  weakFingers.forEach(finger => {
    const words = fingerWordMap[finger] || [];
    targetWords.push(...words);
  });
  
  return targetWords.map(content => ({
    content,
    category: '맞춤연습',
    difficulty: 'medium' as const,
    frequency: 5
  }));
};

export const koreanWordCategories = [
  '전체', '인사', '감정', '관계', '장소', '생활', '기술', '교통', '업무', '학습', '추상', '연습', '맞춤연습'
];