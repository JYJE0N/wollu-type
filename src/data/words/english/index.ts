export interface WordData {
  content: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  frequency: number; // Usage frequency (1-10)
}

export const englishWords: WordData[] = [
  // Basic words - Easy
  { content: 'hello', category: 'greeting', difficulty: 'easy', frequency: 10 },
  { content: 'thank', category: 'greeting', difficulty: 'easy', frequency: 9 },
  { content: 'love', category: 'emotion', difficulty: 'easy', frequency: 9 },
  { content: 'happy', category: 'emotion', difficulty: 'easy', frequency: 8 },
  { content: 'friend', category: 'relationship', difficulty: 'easy', frequency: 8 },
  { content: 'family', category: 'relationship', difficulty: 'easy', frequency: 8 },
  { content: 'school', category: 'place', difficulty: 'easy', frequency: 8 },
  { content: 'house', category: 'place', difficulty: 'easy', frequency: 9 },
  { content: 'food', category: 'daily', difficulty: 'easy', frequency: 8 },
  { content: 'water', category: 'daily', difficulty: 'easy', frequency: 9 },
  
  // Daily life words - Medium
  { content: 'computer', category: 'technology', difficulty: 'medium', frequency: 7 },
  { content: 'internet', category: 'technology', difficulty: 'medium', frequency: 7 },
  { content: 'keyboard', category: 'technology', difficulty: 'medium', frequency: 5 },
  { content: 'monitor', category: 'technology', difficulty: 'medium', frequency: 5 },
  { content: 'telephone', category: 'technology', difficulty: 'medium', frequency: 6 },
  { content: 'television', category: 'technology', difficulty: 'medium', frequency: 6 },
  { content: 'automobile', category: 'transport', difficulty: 'medium', frequency: 6 },
  { content: 'subway', category: 'transport', difficulty: 'medium', frequency: 5 },
  { content: 'airplane', category: 'transport', difficulty: 'medium', frequency: 5 },
  { content: 'hospital', category: 'place', difficulty: 'medium', frequency: 6 },
  
  // Work/Study related - Medium
  { content: 'company', category: 'work', difficulty: 'medium', frequency: 7 },
  { content: 'office', category: 'work', difficulty: 'medium', frequency: 6 },
  { content: 'meeting', category: 'work', difficulty: 'medium', frequency: 6 },
  { content: 'project', category: 'work', difficulty: 'medium', frequency: 6 },
  { content: 'document', category: 'work', difficulty: 'medium', frequency: 6 },
  { content: 'report', category: 'work', difficulty: 'medium', frequency: 5 },
  { content: 'presentation', category: 'work', difficulty: 'medium', frequency: 5 },
  { content: 'education', category: 'study', difficulty: 'medium', frequency: 6 },
  { content: 'training', category: 'study', difficulty: 'medium', frequency: 5 },
  { content: 'examination', category: 'study', difficulty: 'medium', frequency: 5 },
  
  // Emotions/Abstract concepts - Hard
  { content: 'depression', category: 'emotion', difficulty: 'hard', frequency: 4 },
  { content: 'desperation', category: 'emotion', difficulty: 'hard', frequency: 3 },
  { content: 'euphoria', category: 'emotion', difficulty: 'hard', frequency: 3 },
  { content: 'nostalgia', category: 'emotion', difficulty: 'hard', frequency: 4 },
  { content: 'melancholy', category: 'emotion', difficulty: 'hard', frequency: 3 },
  { content: 'philosophy', category: 'abstract', difficulty: 'hard', frequency: 4 },
  { content: 'existence', category: 'abstract', difficulty: 'hard', frequency: 4 },
  { content: 'consciousness', category: 'abstract', difficulty: 'hard', frequency: 3 },
  { content: 'phenomenon', category: 'abstract', difficulty: 'hard', frequency: 3 },
  { content: 'methodology', category: 'abstract', difficulty: 'hard', frequency: 3 },
  
  // Technical terms - Hard
  { content: 'algorithm', category: 'technology', difficulty: 'hard', frequency: 4 },
  { content: 'database', category: 'technology', difficulty: 'hard', frequency: 4 },
  { content: 'programming', category: 'technology', difficulty: 'hard', frequency: 4 },
  { content: 'networking', category: 'technology', difficulty: 'hard', frequency: 4 },
  { content: 'security', category: 'technology', difficulty: 'hard', frequency: 5 },
  { content: 'encryption', category: 'technology', difficulty: 'hard', frequency: 3 },
  { content: 'blockchain', category: 'technology', difficulty: 'hard', frequency: 3 },
  { content: 'artificial', category: 'technology', difficulty: 'hard', frequency: 4 },
  { content: 'intelligence', category: 'technology', difficulty: 'hard', frequency: 4 },
  { content: 'machine', category: 'technology', difficulty: 'hard', frequency: 5 },
  { content: 'learning', category: 'technology', difficulty: 'hard', frequency: 5 },
  
  // Finger-specific practice words
  { content: 'papa', category: 'practice', difficulty: 'easy', frequency: 1 },
  { content: 'aqua', category: 'practice', difficulty: 'easy', frequency: 1 },
  { content: 'queen', category: 'practice', difficulty: 'easy', frequency: 1 },
  { content: 'quiet', category: 'practice', difficulty: 'easy', frequency: 1 },
  { content: 'people', category: 'practice', difficulty: 'easy', frequency: 1 },
  { content: 'little', category: 'practice', difficulty: 'easy', frequency: 1 },
  { content: 'middle', category: 'practice', difficulty: 'easy', frequency: 1 },
  { content: 'letter', category: 'practice', difficulty: 'easy', frequency: 1 },
  
  // Common programming terms
  { content: 'function', category: 'programming', difficulty: 'medium', frequency: 6 },
  { content: 'variable', category: 'programming', difficulty: 'medium', frequency: 6 },
  { content: 'condition', category: 'programming', difficulty: 'medium', frequency: 5 },
  { content: 'statement', category: 'programming', difficulty: 'medium', frequency: 5 },
  { content: 'parameter', category: 'programming', difficulty: 'medium', frequency: 5 },
  { content: 'argument', category: 'programming', difficulty: 'medium', frequency: 5 },
  { content: 'iteration', category: 'programming', difficulty: 'hard', frequency: 4 },
  { content: 'recursion', category: 'programming', difficulty: 'hard', frequency: 3 },
  { content: 'inheritance', category: 'programming', difficulty: 'hard', frequency: 3 },
  { content: 'polymorphism', category: 'programming', difficulty: 'hard', frequency: 2 },
];

// Filter words by category
export const getEnglishWordsByCategory = (category: string) => {
  return englishWords.filter(word => word.category === category);
};

// Filter words by difficulty
export const getEnglishWordsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
  return englishWords.filter(word => word.difficulty === difficulty);
};

// Filter words by frequency
export const getEnglishWordsByFrequency = (minFreq: number) => {
  return englishWords.filter(word => word.frequency >= minFreq);
};

// Get random words with options
export const getRandomEnglishWords = (count: number, options?: {
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  minFrequency?: number;
}) => {
  let filteredWords = [...englishWords];
  
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

// Get targeted words based on weak fingers
export const getTargetedEnglishWords = (weakFingers: string[]) => {
  const fingerWordMap: { [key: string]: string[] } = {
    'left pinky': ['aqua', 'quiz', 'quiet', 'queen', 'quality', 'question', 'quick', 'quote'],
    'left ring': ['west', 'want', 'world', 'water', 'write', 'winter', 'wisdom', 'wonder'],
    'left middle': ['desk', 'data', 'deep', 'dream', 'dance', 'detail', 'develop', 'design'],
    'left index': ['bread', 'bridge', 'bright', 'brother', 'bring', 'break', 'brown', 'build'],
    'right index': ['house', 'heart', 'human', 'happy', 'heavy', 'health', 'height', 'honor'],
    'right middle': ['king', 'kind', 'keep', 'know', 'knowledge', 'kitchen', 'keyboard', 'kids'],
    'right ring': ['love', 'light', 'life', 'learn', 'language', 'leader', 'little', 'logic'],
    'right pinky': ['people', 'paper', 'place', 'point', 'problem', 'program', 'project', 'power']
  };
  
  const targetWords: string[] = [];
  
  weakFingers.forEach(finger => {
    const words = fingerWordMap[finger] || [];
    targetWords.push(...words);
  });
  
  return targetWords.map(content => ({
    content,
    category: 'targeted',
    difficulty: 'medium' as const,
    frequency: 5
  }));
};

export const englishWordCategories = [
  'all', 'greeting', 'emotion', 'relationship', 'place', 'daily', 'technology', 
  'transport', 'work', 'study', 'abstract', 'practice', 'programming', 'targeted'
];