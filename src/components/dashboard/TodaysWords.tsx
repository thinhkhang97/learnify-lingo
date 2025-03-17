
import React from 'react';
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ExternalLink, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

export const TodaysWords = () => {
  const { words, markWordAsLearned } = useUser();
  const navigate = useNavigate();
  
  // Get the words with lowest mastery (still learning)
  const wordsToLearn = [...words]
    .filter(word => word.mastery < 80)
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, 3);

  const handleMarkLearned = (e: React.MouseEvent, wordId: string) => {
    e.stopPropagation();
    markWordAsLearned(wordId);
  };

  const handleWordClick = (wordId: string) => {
    navigate(`/vocabulary/word/${wordId}`);
  };

  return (
    <Card className="animate-slide-up animate-delay-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Today's Words
          </CardTitle>
          <CardDescription>Focus on these words today</CardDescription>
        </div>
        <Button 
          variant="outline" 
          className="text-sm h-8"
          onClick={() => navigate('/vocabulary')}
        >
          <span>View All</span>
          <ExternalLink className="ml-1 h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {wordsToLearn.length > 0 ? (
            wordsToLearn.map((word) => (
              <div 
                key={word.id} 
                className="p-3 rounded-lg border border-border/50 hover:border-border hover:bg-muted/20 cursor-pointer transition-all"
                onClick={() => handleWordClick(word.id)}
              >
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-medium">{word.word}</h3>
                    <p className="text-sm text-muted-foreground">{word.definition}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-950/20"
                    onClick={(e) => handleMarkLearned(e, word.id)}
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span className="sr-only">Mark as learned</span>
                  </Button>
                </div>
                <div className="flex items-center justify-between text-xs mt-2">
                  <span className="text-muted-foreground">Mastery</span>
                  <span className="font-medium">{word.mastery}%</span>
                </div>
                <Progress value={word.mastery} className="h-1.5 mt-1" />
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground text-sm">
                No words to study today. Add some new words to your vocabulary!
              </p>
              <Button 
                className="mt-4" 
                size="sm"
                onClick={() => navigate('/vocabulary/add')}
              >
                Add New Words
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
