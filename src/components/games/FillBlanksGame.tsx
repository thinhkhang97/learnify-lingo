
import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

export const FillBlanksGame = () => {
  const { words, addGameScore } = useUser();
  const { toast } = useToast();
  const [currentRound, setCurrentRound] = useState(0);
  const [maxRounds] = useState(5);
  const [score, setScore] = useState(0);
  const [gameWords, setGameWords] = useState<any[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    // Select random words for the game
    if (words.length >= maxRounds) {
      const shuffled = [...words].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, maxRounds).map(word => {
        // Create a sentence with a blank for the word
        const sentence = word.examples[0] || `This is an example of ${word.word}.`;
        const processedSentence = sentence.replace(new RegExp(word.word, 'gi'), '_______');
        return {
          ...word,
          sentence: processedSentence,
          originalSentence: sentence
        };
      });
      setGameWords(selected);
    }
  }, [words, maxRounds]);

  const checkAnswer = () => {
    if (!userAnswer.trim()) return;
    
    setIsChecking(true);
    const currentWord = gameWords[currentRound];
    const isAnswerCorrect = userAnswer.toLowerCase() === currentWord.word.toLowerCase();
    
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      setScore(prev => prev + 1);
      toast({
        description: "Correct! Well done!",
      });
    } else {
      toast({
        title: "Not quite right",
        description: `The correct answer was "${currentWord.word}".`,
        variant: "destructive",
      });
    }
    
    // Wait before moving to next round
    setTimeout(() => {
      if (currentRound < maxRounds - 1) {
        setCurrentRound(prev => prev + 1);
        setUserAnswer('');
        setIsCorrect(null);
      } else {
        setIsGameOver(true);
        // Save game score
        addGameScore({
          gameType: 'fillBlanks',
          score,
          maxScore: maxRounds,
        });
      }
      setIsChecking(false);
    }, 1500);
  };

  const restartGame = () => {
    // Reset game state
    setCurrentRound(0);
    setScore(0);
    setUserAnswer('');
    setIsCorrect(null);
    setIsGameOver(false);
    
    // Reshuffle words
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, maxRounds).map(word => {
      const sentence = word.examples[0] || `This is an example of ${word.word}.`;
      const processedSentence = sentence.replace(new RegExp(word.word, 'gi'), '_______');
      return {
        ...word,
        sentence: processedSentence,
        originalSentence: sentence
      };
    });
    setGameWords(selected);
  };

  if (words.length < maxRounds) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fill in the Blanks</CardTitle>
          <CardDescription>
            Add more words to your vocabulary to play this game.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You need at least {maxRounds} words in your vocabulary to play.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Fill in the Blanks</CardTitle>
        <CardDescription>
          {isGameOver 
            ? "Game over! See your results below." 
            : "Complete the sentence with the correct word."}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!isGameOver ? (
          <div className="space-y-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Round: {currentRound + 1}/{maxRounds}</span>
              <span>Score: {score}</span>
            </div>
            
            {gameWords[currentRound] && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-md text-lg font-medium">
                  {gameWords[currentRound].sentence}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer"
                    disabled={isChecking}
                    className={isCorrect === null ? "" : isCorrect ? "border-green-500" : "border-red-500"}
                  />
                  <Button onClick={checkAnswer} disabled={isChecking || !userAnswer.trim()}>
                    Check
                  </Button>
                </div>
                
                {isCorrect !== null && (
                  <div className={`p-3 rounded-md flex items-center gap-2 ${
                    isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {isCorrect 
                      ? <CheckCircle className="h-5 w-5" /> 
                      : <AlertCircle className="h-5 w-5" />}
                    <span>
                      {isCorrect 
                        ? "Correct! Well done!" 
                        : `The correct answer is "${gameWords[currentRound].word}".`}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 text-center py-4">
            <h3 className="text-2xl font-bold">Game Over!</h3>
            <div className="text-4xl font-bold">
              {score}/{maxRounds}
            </div>
            <p className="text-muted-foreground">
              {score === maxRounds 
                ? "Perfect score! Amazing job!" 
                : score >= maxRounds / 2 
                  ? "Well done! Keep practicing to improve." 
                  : "Keep practicing to improve your vocabulary."}
            </p>
          </div>
        )}
      </CardContent>
      
      {isGameOver && (
        <CardFooter>
          <Button className="w-full" onClick={restartGame}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Play Again
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
