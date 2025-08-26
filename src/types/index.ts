export interface TypingStats {
  wpm: number;
  cpm: number;
  accuracy: number;
  duration: number;
  totalChars: number;
  correctChars: number;
  incorrectChars: number;
}

export interface TypingSettings {
  wordCount: 1 | 3 | 5 | 10;
  sentenceCount: 1 | 3 | 5 | 10;
  sentenceLength: 'short' | 'medium' | 'long';
  sentenceStyle: 'normal' | 'punctuation' | 'numbers' | 'mixed';
  ghostMode: boolean;
  typingEffect: boolean;
  countdown: boolean;
}

export interface UserTier {
  name: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master';
  color: string;
  minWpm: number;
  minAccuracy: number;
  minPracticeHours: number;
}

export type Language = 'korean' | 'english';
export type TextType = 'word' | 'sentence';

export interface TextData {
  content: string;
  source?: string;
  category?: string;
}

export interface TypingState {
  isActive: boolean;
  currentIndex: number;
  startTime: number | null;
  endTime: number | null;
  errors: number[];
  language: Language;
  textType: TextType;
}