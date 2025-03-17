
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Brain, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Word } from "@/types";

export const WordQuizGame = () => {
  const { words, addGameScore } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [gameWords, setGameWords] = useState<Word[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  
  const totalQuestions = 5;
  
  useEffect(() => {
    if (words.length < totalQuestions) {
      toast({
        title: "Not Enough Words",
        description: `You need at least ${totalQuestions} words in your vocabulary to play this game.`,
        variant: "destructive",
      });
      navigate("/vocabulary");
      return;
    }
    
    // Select random words for the quiz
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    setGameWords(shuffled.slice(0, totalQuestions));
  }, [words, navigate, toast]);
  
  const getOptions = () => {
    if (!gameWords[currentQuestion]) return [];
    
    // Get correct answer
    const correctOption = gameWords[currentQuestion].definition;
    
    // Get 3 random incorrect definitions
    const otherOptions = words
      .filter(w => w.id !== gameWords[currentQuestion].id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(w => w.definition);
    
    // Combine and shuffle
    return [...otherOptions, correctOption].sort(() => 0.5 - Math.random());
  };
  
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };
  
  const handleNextQuestion = () => {
    // Check if answer is correct
    const correct = selectedAnswer === gameWords[currentQuestion].definition;
    
    if (correct) {
      setScore(score + 1);
    }
    
    setIsCorrect(correct);
    setShowResult(true);
  };
  
  const handleContinue = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setGameComplete(true);
      
      // Save game score
      addGameScore({
        gameType: "wordQuiz",
        score: score + (isCorrect ? 1 : 0),
        maxScore: totalQuestions,
      });
      
      toast({
        title: "Game Complete!",
        description: `You scored ${score + (isCorrect ? 1 : 0)} out of ${totalQuestions}`,
      });
    }
  };
  
  const handlePlayAgain = () => {
    // Reset the game
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    setGameWords(shuffled.slice(0, totalQuestions));
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameComplete(false);
  };
  
  const options = getOptions();
  
  if (gameWords.length === 0) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="max-w-2xl mx-auto">
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
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Word Quiz
          </CardTitle>
          <CardDescription>Test your vocabulary knowledge</CardDescription>
        </CardHeader>
        
        <CardContent>
          {!gameComplete ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Question {currentQuestion + 1} of {totalQuestions}</span>
                <span className="text-sm font-medium">Score: {score}</span>
              </div>
              <Progress value={(currentQuestion / totalQuestions) * 100} className="h-2 mb-6" />
              
              <div className="mb-8">
                <h3 className="text-xl font-medium text-center mb-6">
                  What is the definition of "{gameWords[currentQuestion].word}"?
                </h3>
                
                <RadioGroup 
                  value={selectedAnswer || ""} 
                  onValueChange={handleAnswerSelect}
                  className="space-y-3"
                >
                  {options.map((option, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <RadioGroupItem 
                        value={option} 
                        id={`option-${index}`} 
                        disabled={showResult}
                        className={showResult 
                          ? option === gameWords[currentQuestion].definition 
                            ? "border-green-500 text-green-500" 
                            : selectedAnswer === option 
                              ? "border-red-500 text-red-500" 
                              : ""
                          : ""}
                      />
                      <Label 
                        htmlFor={`option-${index}`} 
                        className={`flex-1 cursor-pointer rounded-md border p-4 ${
                          showResult
                            ? option === gameWords[currentQuestion].definition
                              ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                              : selectedAnswer === option
                                ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                                : ""
                            : "hover:bg-muted"
                        }`}
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {showResult ? (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg flex items-center gap-3 ${
                    isCorrect 
                      ? "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-300" 
                      : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-300"
                  }`}>
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium">
                        {isCorrect ? "Correct!" : "Incorrect!"}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm">
                          The correct definition is: {gameWords[currentQuestion].definition}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <Button className="w-full" onClick={handleContinue}>
                    {currentQuestion < totalQuestions - 1 ? "Next Question" : "See Results"}
                  </Button>
                </div>
              ) : (
                <Button 
                  className="w-full" 
                  onClick={handleNextQuestion}
                  disabled={!selectedAnswer}
                >
                  Check Answer
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-8 space-y-6">
              <div className="text-6xl font-bold mb-2">{score}/{totalQuestions}</div>
              <h3 className="text-xl font-medium">
                {score === totalQuestions 
                  ? "Perfect Score! Impressive!" 
                  : score >= totalQuestions * 0.7 
                  ? "Great job! You're doing well." 
                  : "Keep practicing to improve your vocabulary!"}
              </h3>
              
              <div className="pt-4">
                <Button className="w-full" onClick={handlePlayAgain}>
                  Play Again
                </Button>
                <Button variant="outline" className="w-full mt-2" onClick={() => navigate('/games')}>
                  Back to Games
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
