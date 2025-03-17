
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Gamepad2, ArrowLeft, CheckCircle, RefreshCcw, Timer } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Word } from '@/types';

export const WordMatchGame = () => {
  const { words, addGameScore } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [gameWords, setGameWords] = useState<Word[]>([]);
  const [shuffledDefinitions, setShuffledDefinitions] = useState<{id: string, text: string}[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedDefinition, setSelectedDefinition] = useState<string | null>(null);
  const [matches, setMatches] = useState<{[key: string]: string}>({});
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  
  const gameSize = 5;
  
  useEffect(() => {
    if (gameStarted && !gameEnded) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [gameStarted, gameEnded]);
  
  useEffect(() => {
    if (Object.keys(matches).length === gameSize) {
      setIsComplete(true);
      endGame();
    }
  }, [matches]);
  
  const setupGame = () => {
    // Filter out words that have examples
    const availableWords = words.filter(word => !word.learned || word.mastery < 80);
    
    // If not enough words, use all words
    const wordsToUse = availableWords.length >= gameSize 
      ? availableWords 
      : words;
    
    // Randomly select game words
    const selectedWords = [...wordsToUse]
      .sort(() => 0.5 - Math.random())
      .slice(0, gameSize);
    
    setGameWords(selectedWords);
    
    // Create shuffled definitions
    const definitions = selectedWords.map(word => ({
      id: word.id,
      text: word.definition,
    }));
    
    setShuffledDefinitions(definitions.sort(() => 0.5 - Math.random()));
    
    setSelectedWord(null);
    setSelectedDefinition(null);
    setMatches({});
    setIsComplete(false);
    setScore(0);
    setTimeLeft(60);
    setGameStarted(true);
    setGameEnded(false);
  };
  
  const handleWordClick = (wordId: string) => {
    if (matches[wordId] || isComplete) return;
    
    setSelectedWord(wordId);
    
    if (selectedDefinition) {
      checkMatch(wordId, selectedDefinition);
    }
  };
  
  const handleDefinitionClick = (defId: string) => {
    if (Object.values(matches).includes(defId) || isComplete) return;
    
    setSelectedDefinition(defId);
    
    if (selectedWord) {
      checkMatch(selectedWord, defId);
    }
  };
  
  const checkMatch = (wordId: string, defId: string) => {
    // Check if correct match
    const isCorrect = gameWords.find(w => w.id === wordId)?.id === defId;
    
    if (isCorrect) {
      // Add to matches
      setMatches(prev => ({
        ...prev,
        [wordId]: defId,
      }));
      
      setScore(prev => prev + 1);
      
      toast({
        title: "Correct Match!",
        description: "Great job! You found a matching pair.",
        duration: 1500,
      });
    } else {
      toast({
        title: "Try Again",
        description: "Those don't match. Try another pair.",
        variant: "destructive",
        duration: 1500,
      });
    }
    
    // Reset selections
    setSelectedWord(null);
    setSelectedDefinition(null);
  };
  
  const endGame = () => {
    setGameEnded(true);
    setGameStarted(false);
    
    if (!isComplete) {
      toast({
        title: "Time's Up!",
        description: `You matched ${score} out of ${gameSize} words.`,
        duration: 3000,
      });
    } else {
      toast({
        title: "Game Complete!",
        description: `You matched all ${gameSize} words in ${60 - timeLeft} seconds!`,
        duration: 3000,
      });
    }
    
    addGameScore({
      gameType: 'wordMatch',
      score,
      maxScore: gameSize,
    });
  };
  
  const getDefinitionById = (id: string) => {
    return shuffledDefinitions.find(def => def.id === id)?.text || '';
  };
  
  const getWordById = (id: string) => {
    return gameWords.find(word => word.id === id)?.word || '';
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => navigate('/games')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Games
      </Button>
      
      <Card className="shadow-sm animate-in">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Gamepad2 className="h-5 w-5 text-primary" />
                Word Match Game
              </CardTitle>
              <CardDescription>Match words with their correct definitions</CardDescription>
            </div>
            {gameStarted && !gameEnded && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-sm">
                <Timer className="h-4 w-4" />
                <span>{timeLeft}s</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!gameStarted && !gameEnded ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">Ready to Play?</h3>
              <p className="text-muted-foreground mb-6">
                Match each word with its correct definition before time runs out.
              </p>
              <Button onClick={setupGame}>Start Game</Button>
            </div>
          ) : gameEnded ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">Game Finished</h3>
              <p className="text-muted-foreground mb-4">
                You matched {score} out of {gameSize} words.
              </p>
              <div className="mb-6">
                <Progress value={(score / gameSize) * 100} className="h-2" />
                <p className="text-sm text-muted-foreground mt-1">
                  Score: {score}/{gameSize}
                </p>
              </div>
              <Button onClick={setupGame}>Play Again</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Words</h3>
                  <div className="space-y-2">
                    {gameWords.map((word) => (
                      <button
                        key={word.id}
                        className={`w-full p-3 rounded-md text-left transition-all ${
                          matches[word.id]
                            ? 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-800'
                            : selectedWord === word.id
                              ? 'bg-primary/10 border-primary/20'
                              : 'bg-muted hover:bg-muted/80 border-transparent'
                        } ${
                          matches[word.id] ? 'cursor-default' : 'cursor-pointer'
                        } border`}
                        onClick={() => handleWordClick(word.id)}
                        disabled={!!matches[word.id]}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{word.word}</span>
                          {matches[word.id] && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Definitions</h3>
                  <div className="space-y-2">
                    {shuffledDefinitions.map((def) => (
                      <button
                        key={def.id}
                        className={`w-full p-3 rounded-md text-left transition-all ${
                          Object.values(matches).includes(def.id)
                            ? 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-800'
                            : selectedDefinition === def.id
                              ? 'bg-primary/10 border-primary/20'
                              : 'bg-muted hover:bg-muted/80 border-transparent'
                        } ${
                          Object.values(matches).includes(def.id) ? 'cursor-default' : 'cursor-pointer'
                        } border text-sm`}
                        onClick={() => handleDefinitionClick(def.id)}
                        disabled={Object.values(matches).includes(def.id)}
                      >
                        <div className="flex justify-between items-center">
                          <span>{def.text}</span>
                          {Object.values(matches).includes(def.id) && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {Object.keys(matches).length > 0 && (
                <div className="mt-8 space-y-2">
                  <h3 className="font-medium">Matches</h3>
                  <div className="space-y-2">
                    {Object.entries(matches).map(([wordId, defId]) => (
                      <div key={wordId} className="p-3 rounded-md bg-green-100 dark:bg-green-900/20 flex justify-between">
                        <div className="font-medium">{getWordById(wordId)}</div>
                        <div className="text-sm">{getDefinitionById(defId)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
        {gameStarted && !gameEnded && (
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={endGame}>
              Give Up
            </Button>
            <div className="text-sm">
              Matched: {score}/{gameSize}
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
