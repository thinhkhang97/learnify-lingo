
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad, Dumbbell, ListChecks, BookOpen } from 'lucide-react';

export const GameChallenges = () => {
  const navigate = useNavigate();

  const games = [
    {
      id: 'wordMatch',
      name: 'Word Match',
      description: 'Match words with their definitions',
      icon: ListChecks,
      color: 'text-green-500',
      route: '/games/word-match'
    },
    {
      id: 'fillBlanks',
      name: 'Fill in the Blanks',
      description: 'Complete sentences with the correct words',
      icon: BookOpen,
      color: 'text-blue-500',
      route: '/games/fill-blanks'
    },
    {
      id: 'wordQuiz',
      name: 'Word Quiz',
      description: 'Test your knowledge with quick quizzes',
      icon: Dumbbell,
      color: 'text-purple-500',
      route: '/games/word-quiz'
    }
  ];

  return (
    <Card className="animate-slide-up animate-delay-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Gamepad className="h-5 w-5 text-primary" />
          Game Challenges
        </CardTitle>
        <CardDescription>Have fun while learning</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {games.map((game) => (
            <div
              key={game.id}
              className="border border-border/50 rounded-lg p-4 hover:border-border hover:bg-muted/20 transition-all cursor-pointer hover-scale"
              onClick={() => navigate(game.route)}
            >
              <game.icon className={`h-6 w-6 ${game.color} mb-2`} />
              <h3 className="font-medium mb-1">{game.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{game.description}</p>
              <Button 
                className="w-full text-sm mt-auto" 
                size="sm"
                onClick={() => navigate(game.route)}
              >
                Play Now
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
