
export interface Word {
  id: string;
  word: string;
  definition: string;
  examples: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  learned: boolean;
  createdAt: Date;
  lastReviewed?: Date;
  mastery: number; // 0-100
  category?: string;
}

export interface User {
  id: string;
  name: string;
  level: number;
  xp: number;
  streak: number;
  totalWords: number;
  wordsLearned: number;
  wordsInProgress: number;
  learningGoal: 'casual' | 'professional' | 'exam';
  interests: string[];
}

export interface GameScore {
  id: string;
  gameType: string;
  score: number;
  maxScore: number;
  date: Date;
}

export type LearningGoal = 'casual' | 'professional' | 'exam';
export type InterestType = 'travel' | 'business' | 'technology' | 'science' | 'arts' | 'sports' | 'health';
