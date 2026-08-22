export type HSKSystem = 'traditional' | 'new';

export interface ChineseWord {
  id: string;
  character: string;
  pinyin: string;
  thaiMeaning: string;
  englishMeaning: string;
  pos: string; // Part of speech, e.g., "noun", "verb", "pronoun"
  exampleSentence: string;
  examplePinyin: string;
  exampleThai: string;
  exampleEnglish: string;
}

export interface WritingFeedback {
  score: number;
  accuracy: 'excellent' | 'good' | 'fair' | 'poor';
  strokesFeedback: string;
  proportionsFeedback: string;
  generalAdvice: string;
}

export interface QuizQuestion {
  id: string;
  type: 'char-to-meaning' | 'pinyin-to-char' | 'meaning-to-char';
  questionText: string;
  word: ChineseWord;
  options: string[];
  correctAnswer: string;
}

export interface UserStats {
  masteredWordsCount: number;
  quizHighScores: Record<string, number>; // levelKey -> highScore
  streak: number;
  lastStudyDate: string | null;
  history: Array<{
    date: string;
    action: string; // e.g. "Completed Quiz Level 1"
    details: string;
  }>;
}
