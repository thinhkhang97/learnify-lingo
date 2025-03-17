
import React from 'react';
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Trophy, Zap, BarChart } from 'lucide-react';

export const ProgressOverview = () => {
  const { user, words } = useUser();

  if (!user) return null;

  // Calculate mastery percentage
  const totalMastery = words.reduce((acc, word) => acc + word.mastery, 0);
  const averageMastery = words.length > 0 ? Math.round(totalMastery / words.length) : 0;

  // Calculate progress toward goal
  const dailyGoal = 5; // Example daily goal
  const progress = Math.min(100, Math.round((user.wordsLearned / (user.totalWords || 1)) * 100));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up">
      <Card className="hover-scale">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            Vocabulary
          </CardTitle>
          <CardDescription>Your word collection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user.totalWords}</div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-muted-foreground">
              {user.wordsLearned} mastered
            </span>
            <span className="text-sm text-muted-foreground">
              {user.wordsInProgress} learning
            </span>
          </div>
          <Progress value={progress} className="h-1.5 mt-2" />
        </CardContent>
      </Card>

      <Card className="hover-scale">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            Level
          </CardTitle>
          <CardDescription>Your current level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Level {user.level}</div>
          <div className="text-sm text-muted-foreground mt-2">
            {user.xp} experience points
          </div>
          <Progress value={user.xp % 100} className="h-1.5 mt-2" />
          <div className="text-xs text-right mt-1 text-muted-foreground">
            {user.xp % 100}/100 to level {user.level + 1}
          </div>
        </CardContent>
      </Card>

      <Card className="hover-scale">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Zap className="h-4 w-4 text-orange-500" />
            Streak
          </CardTitle>
          <CardDescription>Days in a row</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user.streak} days</div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-muted-foreground">
              Keep it up!
            </span>
          </div>
          <div className="flex gap-1 mt-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full flex-1 ${
                  i < user.streak % 7 ? 'bg-orange-500' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="hover-scale">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <BarChart className="h-4 w-4 text-blue-500" />
            Mastery
          </CardTitle>
          <CardDescription>Average word mastery</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageMastery}%</div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-muted-foreground">
              Overall progress
            </span>
          </div>
          <Progress value={averageMastery} className="h-1.5 mt-2" />
        </CardContent>
      </Card>
    </div>
  );
};
