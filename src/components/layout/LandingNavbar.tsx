
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export const LandingNavbar = () => {
  return (
    <header className="border-b border-border/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-xl font-medium tracking-tight">
              LearnSmart
            </span>
          </Link>
        </div>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <nav className="flex flex-col gap-4 mt-8">
              <Link to="/app/dashboard" className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-muted">
                Dashboard
              </Link>
              <Link to="/app/vocabulary" className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-muted">
                My Words
              </Link>
              <Link to="/app/games" className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-muted">
                Games
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/app/dashboard" className="text-foreground/70 hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Link to="/app/vocabulary" className="text-foreground/70 hover:text-foreground transition-colors">
            My Words
          </Link>
          <Link to="/app/games" className="text-foreground/70 hover:text-foreground transition-colors">
            Games
          </Link>
          <Link to="/app/dashboard">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};
