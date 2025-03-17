
import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { 
  GraduationCap, 
  Menu, 
  X, 
  Search, 
  Bell,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from '@/components/ui/use-toast';

export const Navbar = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleProfileClick = () => {
    toast({
      title: "Coming Soon",
      description: "Profile settings will be available in a future update.",
      duration: 3000,
    });
  };

  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link to="/" className="flex items-center gap-2 text-lg font-medium">
                  <GraduationCap className="h-6 w-6" />
                  <span>LearnSmart</span>
                </Link>
                <Link to="/app/dashboard" className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-muted">
                  Dashboard
                </Link>
                <Link to="/app/vocabulary" className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-muted">
                  My Words
                </Link>
                <Link to="/app/games" className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-muted">
                  Games
                </Link>
                <Link to="/app/practice" className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-muted">
                  Practice
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-xl font-medium tracking-tight hidden sm:inline-block">
              LearnSmart
            </span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 max-w-md mx-auto hidden md:flex">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search for words..."
              className="w-full bg-background pl-8 py-2 text-sm rounded-full border border-input shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          <div className="flex items-center gap-2">
            {user && (
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium">{user.name}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">Level {user.level}</span>
                  <span className="text-xs text-primary">{user.xp} XP</span>
                </div>
              </div>
            )}
            <Button variant="ghost" size="icon" onClick={handleProfileClick}>
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
