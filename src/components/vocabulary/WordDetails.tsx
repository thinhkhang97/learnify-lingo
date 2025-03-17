
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, Edit, CheckCircle, Trash2, MessageSquare, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Word } from '@/types';

export const WordDetails = () => {
  const { words, updateWordMastery, markWordAsLearned } = useUser();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const word = words.find(w => w.id === id);
  const [masteryValue, setMasteryValue] = useState<number>(word?.mastery || 0);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!word) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Word Not Found</h2>
        <p className="mb-6">The word you're looking for doesn't exist in your vocabulary.</p>
        <Button onClick={() => navigate('/vocabulary')}>
          Return to Vocabulary
        </Button>
      </div>
    );
  }

  const handleMasteryChange = (value: number[]) => {
    setMasteryValue(value[0]);
  };

  const handleSaveMastery = () => {
    updateWordMastery(word.id, masteryValue);
    toast({
      title: "Mastery Updated",
      description: `You've updated your mastery of "${word.word}" to ${masteryValue}%.`,
    });
  };

  const handleGenerateExample = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate API call for generating an example
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock generated content
      const examples = [
        `The ${word.word} concept was fundamental to understanding the entire framework.`,
        `She demonstrated her ${word.word} skills during the presentation.`,
        `The ${word.word} approach solved problems that had stumped experts for years.`
      ];
      
      setGeneratedContent(examples[Math.floor(Math.random() * examples.length)]);
      
      toast({
        title: "Example Generated",
        description: "New example sentence generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate an example. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateStory = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate API call for generating a story
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock generated content
      setGeneratedContent(
        `Once upon a time, there was a scholar who was renowned for their ${word.word} approach to solving complex problems. 
        
        Many came from far away lands seeking their guidance, hoping to learn the art of ${word.word} thinking. The scholar would always say, "To truly understand ${word.word}, one must practice it daily in all aspects of life."
        
        Through dedication and persistence, the scholar's students mastered the concept and spread the wisdom of ${word.word} throughout the kingdom, transforming how people approached challenges.`
      );
      
      toast({
        title: "Story Generated",
        description: "Short story generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate a story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => navigate('/vocabulary')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Vocabulary
      </Button>
      
      <div className="space-y-6">
        <Card className="shadow-sm animate-in">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
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
                  {word.category && (
                    <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded-full">
                      {word.category}
                    </span>
                  )}
                </div>
                <CardTitle className="text-3xl font-bold">{word.word}</CardTitle>
                <CardDescription className="text-lg mt-1">{word.definition}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                {!word.learned && (
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => markWordAsLearned(word.id)}
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span className="sr-only">Mark as learned</span>
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Example Sentences</h3>
              <ul className="space-y-2">
                {word.examples.length > 0 ? (
                  word.examples.map((example, index) => (
                    <li 
                      key={index} 
                      className="p-3 bg-muted/50 rounded-md text-sm"
                    >
                      {example}
                    </li>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm italic">No examples available.</p>
                )}
              </ul>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Your Mastery</h3>
                <span className="text-sm font-medium">{masteryValue}%</span>
              </div>
              <Slider
                defaultValue={[word.mastery]}
                value={[masteryValue]}
                onValueChange={handleMasteryChange}
                max={100}
                step={5}
                className="mb-4"
              />
              <div className="flex justify-end">
                <Button onClick={handleSaveMastery} size="sm">
                  Update Mastery
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm animate-in animate-delay-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Generate Content
            </CardTitle>
            <CardDescription>
              Create personalized content using this word
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="example" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="example" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Example Sentence
                </TabsTrigger>
                <TabsTrigger value="story" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Short Story
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="example" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Generate a new example sentence using the word "{word.word}".
                </p>
                <Button 
                  onClick={handleGenerateExample} 
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? 'Generating...' : 'Generate Example Sentence'}
                </Button>
              </TabsContent>
              
              <TabsContent value="story" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Generate a short story incorporating the word "{word.word}".
                </p>
                <Button 
                  onClick={handleGenerateStory} 
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? 'Generating...' : 'Generate Short Story'}
                </Button>
              </TabsContent>
            </Tabs>

            {generatedContent && (
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Generated Content</h3>
                <div className="p-4 bg-muted/50 rounded-md text-sm whitespace-pre-line">
                  {generatedContent}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
