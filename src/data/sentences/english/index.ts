export interface SentenceData {
  content: string;
  source?: string;
  category: string;
  length: 'short' | 'medium' | 'long';
}

export const englishSentences: SentenceData[] = [
  // Philosophy - Short
  {
    content: "I think, therefore I am.",
    source: "René Descartes",
    category: "philosophy",
    length: "short"
  },
  {
    content: "Life is what happens when you're busy making other plans.",
    source: "John Lennon",
    category: "philosophy",
    length: "short"
  },
  {
    content: "The only thing we have to fear is fear itself.",
    source: "Franklin D. Roosevelt",
    category: "philosophy",
    length: "short"
  },

  // Quotes - Medium
  {
    content: "Be yourself; everyone else is already taken.",
    source: "Oscar Wilde",
    category: "quotes",
    length: "medium"
  },
  {
    content: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
    source: "Albert Einstein",
    category: "quotes",
    length: "medium"
  },
  {
    content: "In the end, we will remember not the words of our enemies, but the silence of our friends.",
    source: "Martin Luther King Jr.",
    category: "quotes",
    length: "medium"
  },

  // Literature - Long
  {
    content: "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness.",
    source: "Charles Dickens",
    category: "literature",
    length: "long"
  },
  {
    content: "All happy families are alike; each unhappy family is unhappy in its own way.",
    source: "Leo Tolstoy",
    category: "literature",
    length: "long"
  },

  // Proverbs
  {
    content: "Actions speak louder than words.",
    category: "proverbs",
    length: "short"
  },
  {
    content: "A picture is worth a thousand words.",
    category: "proverbs",
    length: "short"
  },
  {
    content: "Don't count your chickens before they hatch.",
    category: "proverbs",
    length: "short"
  },

  // Modern Philosophy
  {
    content: "The meaning of life is to give life meaning.",
    source: "Viktor Frankl",
    category: "modern philosophy",
    length: "medium"
  },
  {
    content: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    source: "Aristotle",
    category: "modern philosophy",
    length: "medium"
  },

  // Inspirational
  {
    content: "The only impossible journey is the one you never begin.",
    source: "Tony Robbins",
    category: "inspirational",
    length: "medium"
  },
  {
    content: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    source: "Winston Churchill",
    category: "inspirational",
    length: "medium"
  }
];

export const getEnglishSentencesByLength = (length: 'short' | 'medium' | 'long') => {
  return englishSentences.filter(sentence => sentence.length === length);
};

export const getEnglishSentencesByCategory = (category: string) => {
  return englishSentences.filter(sentence => sentence.category === category);
};

export const getRandomEnglishSentences = (count: number, length?: 'short' | 'medium' | 'long') => {
  const filtered = length ? getEnglishSentencesByLength(length) : englishSentences;
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};