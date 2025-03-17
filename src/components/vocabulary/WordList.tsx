
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Plus,
  SortAsc,
  SortDesc,
  Filter,
  CheckCircle,
  BookOpen,
  Clock
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Word } from '@/types';

export const WordList = () => {
  const { words, markWordAsLearned } = useUser();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [tabValue, setTabValue] = useState('all');

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const filteredWords = words.filter(word => {
    const matchesSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         word.definition.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (tabValue === 'all') return matchesSearch;
    if (tabValue === 'learning') return matchesSearch && !word.learned;
    if (tabValue === 'mastered') return matchesSearch && word.learned;
    return matchesSearch;
  });

  const sortedWords = [...filteredWords].sort((a, b) => {
    const comparison = a.word.localeCompare(b.word);
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleWordClick = (wordId: string) => {
    navigate(`/vocabulary/word/${wordId}`);
  };

  const handleMarkLearned = (e: React.MouseEvent, wordId: string) => {
    e.stopPropagation();
    markWordAsLearned(wordId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search words..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSortDirection}
            title={`Sort ${sortDirection === 'asc' ? 'A to Z' : 'Z to A'}`}
          >
            {sortDirection === 'asc' ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            title="Filter words"
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => navigate('/vocabulary/add')}
            className="ml-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Word
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" value={tabValue} onValueChange={setTabValue}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">All Words</span>
            <span className="sm:hidden">All</span>
          </TabsTrigger>
          <TabsTrigger value="learning" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Learning</span>
            <span className="sm:hidden">Learning</span>
          </TabsTrigger>
          <TabsTrigger value="mastered" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Mastered</span>
            <span className="sm:hidden">Mastered</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="m-0">
          <WordGrid 
            words={sortedWords} 
            onWordClick={handleWordClick} 
            onMarkLearned={handleMarkLearned} 
          />
        </TabsContent>
        
        <TabsContent value="learning" className="m-0">
          <WordGrid 
            words={sortedWords} 
            onWordClick={handleWordClick} 
            onMarkLearned={handleMarkLearned} 
          />
        </TabsContent>
        
        <TabsContent value="mastered" className="m-0">
          <WordGrid 
            words={sortedWords} 
            onWordClick={handleWordClick} 
            onMarkLearned={handleMarkLearned} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface WordGridProps {
  words: Word[];
  onWordClick: (wordId: string) => void;
  onMarkLearned: (e: React.MouseEvent, wordId: string) => void;
}

const WordGrid: React.FC<WordGridProps> = ({ words, onWordClick, onMarkLearned }) => {
  if (words.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground opacity-40 mb-4" />
          <p className="text-center text-muted-foreground">No words found. Add some new words to your vocabulary.</p>
          <Button className="mt-4" onClick={() => navigate('/vocabulary/add')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Word
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {words.map((word) => (
        <div
          key={word.id}
          className="p-4 rounded-lg border hover:border-border hover:bg-muted/20 cursor-pointer transition-all hover-scale"
          onClick={() => onWordClick(word.id)}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{word.word}</h3>
                {word.level && (
                  <span 
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      word.level === 'beginner' 
                        ? 'bg-green-100 text-green-700' 
                        : word.level === 'intermediate' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {word.level}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {word.definition}
              </p>
            </div>
            {!word.learned && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-950/20"
                onClick={(e) => onMarkLearned(e, word.id)}
              >
                <CheckCircle className="h-4 w-4" />
                <span className="sr-only">Mark as learned</span>
              </Button>
            )}
          </div>
          <div className="flex items-center justify-between mt-3 text-xs">
            <span className="text-muted-foreground">Mastery</span>
            <span className="font-medium">{word.mastery}%</span>
          </div>
          <Progress value={word.mastery} className="h-1.5 mt-1" />
        </div>
      ))}
    </div>
  );
};

// TypeScript throws an error if navigate is used directly in the function component
// This is a trick to make it available in the inner component
const navigate = useNavigate();
