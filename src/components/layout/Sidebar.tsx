
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  BookOpen, 
  Gamepad2, 
  Dumbbell, 
  Settings, 
  Trophy,
  BarChart
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { Progress } from '@/components/ui/progress';

export const Sidebar = () => {
  const location = useLocation();
  const { user } = useUser();
  
  const links = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'My Words', path: '/vocabulary', icon: BookOpen },
    { name: 'Games', path: '/games', icon: Gamepad2 },
    { name: 'Practice', path: '/practice', icon: Dumbbell },
    { name: 'Statistics', path: '/statistics', icon: BarChart },
  ];

  return (
    <aside className="hidden md:flex md:w-60 lg:w-72 flex-col border-r border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col flex-1 px-4 py-6 gap-6">
        <div className="space-y-2">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted",
                location.pathname === link.path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <link.icon className="h-4 w-4" />
              <span>{link.name}</span>
            </Link>
          ))}
        </div>

        <div className="mt-auto space-y-4">
          {user && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Daily Streak</span>
                <span className="text-sm font-semibold text-primary">{user.streak} days</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Level {user.level}</span>
                  <span className="text-xs text-muted-foreground">{user.xp % 100}/{100} XP</span>
                </div>
                <Progress value={user.xp % 100} className="h-1.5" />
              </div>
              
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span className="text-xs text-muted-foreground">{user.wordsLearned} words mastered</span>
              </div>
            </div>
          )}
          
          <Link
            to="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-muted"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};
