export interface SentenceData {
  content: string;
  source?: string;
  category: string;
  length: 'short' | 'medium' | 'long';
}

export const koreanSentences: SentenceData[] = [
  // 철학 및 격언 - 단문
  {
    content: "분노는 낮은 곳으로 향한다.",
    source: "익명",
    category: "철학",
    length: "short"
  },
  {
    content: "인간의 존엄성은 두려움에서 나온다.",
    source: "익명",
    category: "철학",
    length: "short"
  },
  {
    content: "시간은 치료하지 않는다. 익숙해질 뿐이다.",
    source: "익명",
    category: "철학",
    length: "short"
  },
  
  // 명언 - 중문
  {
    content: "가장 큰 영광은 넘어지지 않는 것이 아니라 넘어질 때마다 일어서는 것이다.",
    source: "공자",
    category: "명언",
    length: "medium"
  },
  {
    content: "꿈을 포기하지 마라. 꿈이 없으면 아무것도 남지 않는다.",
    source: "익명",
    category: "명언",
    length: "medium"
  },
  {
    content: "오늘 할 수 있는 일을 내일로 미루지 말고, 내일 할 일을 오늘 하지도 말라.",
    source: "익명",
    category: "명언",
    length: "medium"
  },

  // 고전문학 - 장문
  {
    content: "산은 높고 물은 깊어도 사람의 정은 더 깊다고 하였거늘, 그 정이 얕아서야 어찌 사랑이라 하리오.",
    source: "춘향전",
    category: "고전문학",
    length: "long"
  },
  {
    content: "백발이 삼천 길이나 되어도 근심으로 생긴 것이니, 거울 속을 보니 어찌 이리도 늙었는고.",
    source: "이백",
    category: "고전문학",
    length: "long"
  },

  // 속담
  {
    content: "가는 말이 고와야 오는 말이 곱다.",
    category: "속담",
    length: "short"
  },
  {
    content: "개구리 올챙이 적 생각 못한다.",
    category: "속담",
    length: "short"
  },
  {
    content: "똥 묻은 개가 겨 묻은 개 나무란다.",
    category: "속담",
    length: "short"
  },

  // 현대 철학
  {
    content: "우리는 선택할 자유가 있지만, 선택하지 않을 자유는 없다.",
    source: "장 폴 사르트르",
    category: "현대철학",
    length: "medium"
  },
  {
    content: "인생의 의미는 삶을 사는 방식에 있지, 삶의 길이에 있지 않다.",
    source: "익명",
    category: "현대철학",
    length: "medium"
  },

  // 시조
  {
    content: "청산리 벽계수야 수이 감을 자랑 마라. 일도창해하면 다시 오기 어려워라.",
    source: "황진이",
    category: "시조",
    length: "medium"
  },
  {
    content: "동창이 밝았느냐 노고지리 우지진다. 소치는 아이는 상긔 아니 일었느냐.",
    source: "박인로",
    category: "시조",
    length: "medium"
  }
];

export const getKoreanSentencesByLength = (length: 'short' | 'medium' | 'long') => {
  return koreanSentences.filter(sentence => sentence.length === length);
};

export const getKoreanSentencesByCategory = (category: string) => {
  return koreanSentences.filter(sentence => sentence.category === category);
};

export const getRandomKoreanSentences = (count: number, length?: 'short' | 'medium' | 'long') => {
  const filtered = length ? getKoreanSentencesByLength(length) : koreanSentences;
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};