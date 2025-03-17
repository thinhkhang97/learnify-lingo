
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad, Brain, ListChecks, BookOpen, PencilRuler, Dumbbell } from "lucide-react";

const Games = () => {
  const navigate = useNavigate();

  const games = [
    {
      id: "wordMatch",
      name: "Word Match",
      description: "Match words with their definitions to improve word recognition",
      icon: ListChecks,
      color: "text-green-500",
      route: "/games/word-match"
    },
    {
      id: "fillBlanks",
      name: "Fill in the Blanks",
      description: "Complete sentences with the correct words to test your comprehension",
      icon: PencilRuler,
      color: "text-blue-500",
      route: "/games/fill-blanks"
    },
    {
      id: "wordQuiz",
      name: "Word Quiz",
      description: "Test your vocabulary with multiple-choice questions",
      icon: Brain,
      color: "text-purple-500",
      route: "/games/word-quiz"
    },
    {
      id: "flashCards",
      name: "Flash Cards",
      description: "Review words quickly with interactive flash cards",
      icon: BookOpen,
      color: "text-amber-500",
      route: "/games/flash-cards"
    },
    {
      id: "wordStrength",
      name: "Word Strength",
      description: "Train your word mastery by rating how well you know each word",
      icon: Dumbbell,
      color: "text-red-500",
      route: "/games/word-strength"
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
        <Gamepad className="h-8 w-8 text-primary" />
        Learning Games
      </h1>
      <p className="text-muted-foreground">
        Improve your vocabulary with these interactive games and challenges
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Card
            key={game.id}
            className="hover:shadow-md transition-all cursor-pointer hover-scale"
            onClick={() => navigate(game.route)}
          >
            <CardHeader className="pb-2">
              <game.icon className={`h-8 w-8 ${game.color} mb-2`} />
              <CardTitle className="text-xl">{game.name}</CardTitle>
              <CardDescription>{game.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(game.route);
                }}
              >
                Play Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Games;
