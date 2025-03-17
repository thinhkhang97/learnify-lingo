import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Word, GameScore, LearningGoal, InterestType } from '@/types';

interface UserContextType {
  user: User | null;
  words: Word[];
  gameScores: GameScore[];
  isLoading: boolean;
  addWord: (word: Omit<Word, 'id' | 'createdAt'>) => void;
  markWordAsLearned: (wordId: string) => void;
  updateWordMastery: (wordId: string, masteryValue: number) => void;
  setUserGoal: (goal: LearningGoal) => void;
  setUserInterests: (interests: InterestType[]) => void;
  addGameScore: (score: Omit<GameScore, 'id' | 'date'>) => void;
}

// Mock data for development
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  level: 5,
  xp: 1250,
  streak: 7,
  totalWords: 120,
  wordsLearned: 78,
  wordsInProgress: 42,
  learningGoal: 'casual',
  interests: ['travel', 'technology'],
};

const mockWords: Word[] = [
  {
    id: '1',
    word: 'ephemeral',
    definition: 'lasting for a very short time',
    examples: ['The ephemeral nature of fashion trends', 'These ephemeral pleasures bring temporary joy'],
    level: 'advanced',
    learned: false,
    createdAt: new Date('2023-05-10'),
    mastery: 30,
    category: 'literature',
  },
  {
    id: '2',
    word: 'ubiquitous',
    definition: 'present, appearing, or found everywhere',
    examples: ['Mobile phones are now ubiquitous', 'The ubiquitous nature of social media in modern life'],
    level: 'advanced',
    learned: false,
    createdAt: new Date('2023-05-12'),
    mastery: 45,
    category: 'technology',
  },
  {
    id: '3',
    word: 'ambiguous',
    definition: 'open to more than one interpretation',
    examples: ['His response was ambiguous', 'The ambiguous wording of the contract led to misunderstandings'],
    level: 'intermediate',
    learned: true,
    createdAt: new Date('2023-05-01'),
    lastReviewed: new Date('2023-05-20'),
    mastery: 85,
    category: 'business',
  },
  {
    id: '4',
    word: 'resilient',
    definition: 'able to withstand or recover quickly from difficult conditions',
    examples: ['A resilient economic system', 'Children are often remarkably resilient in the face of adversity'],
    level: 'intermediate',
    learned: true,
    createdAt: new Date('2023-04-25'),
    lastReviewed: new Date('2023-05-18'),
    mastery: 90,
    category: 'psychology',
  },
  {
    id: '5',
    word: 'pragmatic',
    definition: 'dealing with things sensibly and realistically',
    examples: ['A pragmatic approach to solving problems', 'She\'s very pragmatic about financial matters'],
    level: 'intermediate',
    learned: false,
    createdAt: new Date('2023-05-15'),
    mastery: 20,
    category: 'business',
  },
];

const mockGameScores: GameScore[] = [
  {
    id: '1',
    gameType: 'wordMatch',
    score: 8,
    maxScore: 10,
    date: new Date('2023-05-18'),
  },
  {
    id: '2',
    gameType: 'fillBlanks',
    score: 7,
    maxScore: 10,
    date: new Date('2023-05-19'),
  },
];

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(mockUser);
  const [words, setWords] = useState<Word[]>(mockWords);
  const [gameScores, setGameScores] = useState<GameScore[]>(mockGameScores);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This would be the place to fetch user data from an API
    const fetchData = async () => {
      try {
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const addWord = (newWord: Omit<Word, 'id' | 'createdAt'>) => {
    const word: Word = {
      ...newWord,
      id: Date.now().toString(),
      createdAt: new Date(),
      mastery: 0,
      learned: false,
    };

    setWords(prevWords => [...prevWords, word]);
    
    // Update user stats
    if (user) {
      setUser({
        ...user,
        totalWords: user.totalWords + 1,
        wordsInProgress: user.wordsInProgress + 1,
      });
    }
  };

  const markWordAsLearned = (wordId: string) => {
    setWords(prevWords =>
      prevWords.map(word =>
        word.id === wordId
          ? { ...word, learned: true, lastReviewed: new Date() }
          : word
      )
    );

    // Update user stats
    if (user) {
      setUser({
        ...user,
        wordsLearned: user.wordsLearned + 1,
        wordsInProgress: user.wordsInProgress - 1,
        xp: user.xp + 10, // Award XP for learning a word
      });
    }
  };

  const updateWordMastery = (wordId: string, masteryValue: number) => {
    setWords(prevWords =>
      prevWords.map(word =>
        word.id === wordId
          ? { 
              ...word, 
              mastery: masteryValue,
              learned: masteryValue >= 80 ? true : word.learned,
              lastReviewed: new Date() 
            }
          : word
      )
    );

    // If mastery reaches 80% and the word wasn't already learned, update user stats
    const word = words.find(w => w.id === wordId);
    if (word && !word.learned && masteryValue >= 80 && user) {
      setUser({
        ...user,
        wordsLearned: user.wordsLearned + 1,
        wordsInProgress: user.wordsInProgress - 1,
        xp: user.xp + 10,
      });
    }
  };

  const setUserGoal = (goal: LearningGoal) => {
    if (user) {
      setUser({ ...user, learningGoal: goal });
    }
  };

  const setUserInterests = (interests: InterestType[]) => {
    if (user) {
      setUser({ ...user, interests: interests as string[] });
    }
  };

  const addGameScore = (score: Omit<GameScore, 'id' | 'date'>) => {
    const newScore: GameScore = {
      ...score,
      id: Date.now().toString(),
      date: new Date(),
    };

    setGameScores(prevScores => [...prevScores, newScore]);

    // Update user XP based on game performance
    if (user) {
      const xpEarned = Math.round((score.score / score.maxScore) * 20); // Up to 20 XP per game
      const newXp = user.xp + xpEarned;
      const newLevel = Math.floor(newXp / 100); // Level up every 100 XP

      setUser({
        ...user,
        xp: newXp,
        level: newLevel,
      });
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        words,
        gameScores,
        isLoading,
        addWord,
        markWordAsLearned,
        updateWordMastery,
        setUserGoal,
        setUserInterests,
        addGameScore,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
