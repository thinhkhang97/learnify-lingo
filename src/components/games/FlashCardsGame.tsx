
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, BookOpen, ArrowRight, ArrowLeft as ArrowLeftIcon, RotateCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Word } from "@/types";

export const FlashCardsGame = () => {
  const { words, updateWordMastery } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [flashCards, setFlashCards] = useState<Word[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardsReviewed, setCardsReviewed] = useState(0);
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
  
  const totalCards = 10;
  
  useEffect(() => {
    if (words.length < 1) {
      toast({
        title: "No Words Found",
        description: "You need to add words to your vocabulary first.",
        variant: "destructive",
      });
      navigate("/vocabulary");
      return;
    }
    
    // Prioritize words with lower mastery
    const prioritized = [...words]
      .sort((a, b) => a.mastery - b.mastery)
      .slice(0, Math.min(words.length, totalCards));
    
    setFlashCards(prioritized);
    
    // Initialize ratings
    const initialRatings: Record<string, number> = {};
    prioritized.forEach(word => {
      initialRatings[word.id] = 0;
    });
    setUserRatings(initialRatings);
  }, [words, navigate, toast]);
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  const handleNextCard = () => {
    if (currentCard < flashCards.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
      setCardsReviewed(cardsReviewed + 1);
    } else {
      // End of deck
      handleFinish();
    }
  };
  
  const handlePrevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setIsFlipped(false);
    }
  };
  
  const handleRating = (rating: number) => {
    const wordId = flashCards[currentCard].id;
    setUserRatings(prev => ({
      ...prev,
      [wordId]: rating
    }));
    
    // Calculate mastery increase based on user rating (1-5)
    const masteryIncrease = rating * 5; // 5, 10, 15, 20, 25
    
    // Update word mastery
    const currentMastery = flashCards[currentCard].mastery;
    const newMastery = Math.min(100, currentMastery + masteryIncrease);
    
    updateWordMastery(wordId, newMastery);
    
    // Move to next card
    handleNextCard();
  };
  
  const handleFinish = () => {
    toast({
      title: "Review Complete!",
      description: `You've reviewed ${cardsReviewed + 1} flash cards.`,
    });
    
    navigate('/dashboard');
  };
  
  const handleRestart = () => {
    setCurrentCard(0);
    setIsFlipped(false);
    setCardsReviewed(0);
    setUserRatings({});
  };
  
  if (flashCards.length === 0) {
    return <div>Loading...</div>;
  }
  
  const currentWord = flashCards[currentCard];
  
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
            <BookOpen className="h-5 w-5 text-primary" />
            Flash Cards
          </CardTitle>
          <CardDescription>Review your vocabulary with interactive flash cards</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Card {currentCard + 1} of {flashCards.length}</span>
              <span className="text-sm font-medium">Mastery: {currentWord.mastery}%</span>
            </div>
            <Progress value={(currentCard / flashCards.length) * 100} className="h-2 mb-6" />
            
            <div 
              className="min-h-[250px] cursor-pointer"
              onClick={handleFlip}
            >
              <div className={`relative transform transition-all duration-300 ${isFlipped ? "scale-100" : "scale-100"}`}>
                <div className={`p-10 border rounded-lg shadow-sm text-center transform transition-all duration-500 ${
                  isFlipped ? "opacity-0 absolute inset-0" : "opacity-100"
                }`}>
                  <h3 className="text-3xl font-bold mb-4">{currentWord.word}</h3>
                  {currentWord.category && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                      {currentWord.category}
                    </span>
                  )}
                  <p className="text-sm text-muted-foreground mt-6">Click to reveal definition</p>
                </div>
                
                <div className={`p-10 border rounded-lg shadow-sm text-center transform transition-all duration-500 ${
                  isFlipped ? "opacity-100" : "opacity-0 absolute inset-0"
                }`}>
                  <p className="text-lg mb-4">{currentWord.definition}</p>
                  
                  {currentWord.examples.length > 0 && (
                    <div className="mt-6 text-left">
                      <h4 className="text-sm font-medium mb-2">Example:</h4>
                      <p className="text-sm italic text-muted-foreground">
                        {currentWord.examples[0]}
                      </p>
                    </div>
                  )}
                  
                  <p className="text-sm text-muted-foreground mt-6">Click to see word</p>
                </div>
              </div>
            </div>
            
            {isFlipped && (
              <div className="space-y-4 mt-6">
                <p className="text-sm font-medium text-center">How well did you know this word?</p>
                <div className="flex justify-between gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      variant={rating <= 2 ? "outline" : rating === 3 ? "secondary" : "default"}
                      className={`flex-1 ${rating <= 2 ? "hover:bg-red-50 hover:text-red-600" : rating === 3 ? "hover:bg-yellow-50 hover:text-yellow-600" : "hover:bg-green-50 hover:text-green-600"}`}
                      onClick={() => handleRating(rating)}
                    >
                      {rating === 1 ? "Not at all" : 
                       rating === 2 ? "Barely" : 
                       rating === 3 ? "Somewhat" : 
                       rating === 4 ? "Well" : "Very well"}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-between mt-6">
              <Button 
                variant="outline" 
                onClick={handlePrevCard}
                disabled={currentCard === 0}
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <Button
                variant="outline"
                onClick={handleRestart}
                className="mx-2"
              >
                <RotateCw className="h-4 w-4 mr-2" />
                Restart
              </Button>
              
              <Button 
                onClick={handleNextCard}
              >
                {currentCard < flashCards.length - 1 ? (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  "Finish"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
