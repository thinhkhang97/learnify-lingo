
import React from 'react';
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle, Trophy, Gamepad2 } from 'lucide-react';

export const RecentActivity = () => {
  const { words, gameScores } = useUser();

  // Sort words by creation date (most recent first)
  const recentWords = [...words]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Sort game scores by date (most recent first)
  const recentScores = [...gameScores]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Combine and sort all recent activity
  const allActivity = [
    ...recentWords.map(word => ({
      type: 'word',
      date: word.createdAt,
      data: word,
    })),
    ...recentScores.map(score => ({
      type: 'score',
      date: score.date,
      data: score,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 5);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return new Date(date).toLocaleDateString();
    }
  };
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'word':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'score':
        return <Gamepad2 className="h-4 w-4 text-indigo-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityText = (activity: any) => {
    if (activity.type === 'word') {
      return `Added "${activity.data.word}" to vocabulary`;
    } else if (activity.type === 'score') {
      return `Played ${activity.data.gameType} game (${activity.data.score}/${activity.data.maxScore})`;
    }
    return '';
  };

  return (
    <Card className="animate-slide-up animate-delay-100">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
        <CardDescription>Your latest learning activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allActivity.length > 0 ? (
            allActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {getActivityText(activity)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(activity.date)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No recent activity.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
