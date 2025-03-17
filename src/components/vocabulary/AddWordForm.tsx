
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, BookOpen, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const AddWordForm = () => {
  const { addWord } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [wordData, setWordData] = useState({
    word: '',
    definition: '',
    examples: [''],
    level: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
    category: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setWordData(prev => ({ ...prev, [name]: value }));
  };

  const handleExampleChange = (index: number, value: string) => {
    const newExamples = [...wordData.examples];
    newExamples[index] = value;
    setWordData(prev => ({ ...prev, examples: newExamples }));
  };

  const addExample = () => {
    setWordData(prev => ({
      ...prev,
      examples: [...prev.examples, ''],
    }));
  };

  const removeExample = (index: number) => {
    if (wordData.examples.length <= 1) return;
    const newExamples = wordData.examples.filter((_, i) => i !== index);
    setWordData(prev => ({
      ...prev,
      examples: newExamples,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!wordData.word.trim() || !wordData.definition.trim()) {
      toast({
        title: "Validation Error",
        description: "Word and definition are required.",
        variant: "destructive",
      });
      return;
    }
    
    // Filter out empty examples
    const filteredExamples = wordData.examples.filter(ex => ex.trim() !== '');
    
    addWord({
      ...wordData,
      examples: filteredExamples,
      mastery: 0,
      learned: false,
    });
    
    toast({
      title: "Word Added",
      description: `"${wordData.word}" has been added to your vocabulary.`,
    });
    
    navigate('/vocabulary');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => navigate('/vocabulary')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Vocabulary
      </Button>
      
      <Card className="shadow-sm animate-in">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Add New Word
          </CardTitle>
          <CardDescription>Expand your vocabulary with new words</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="word">Word</Label>
                <Input
                  id="word"
                  name="word"
                  placeholder="Enter a word"
                  value={wordData.word}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category (Optional)</Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="e.g., Business, Technology"
                  value={wordData.category}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="definition">Definition</Label>
              <Textarea
                id="definition"
                name="definition"
                placeholder="Enter the definition"
                value={wordData.definition}
                onChange={handleChange}
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Example Sentences</Label>
              {wordData.examples.map((example, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <Textarea
                    placeholder={`Example ${index + 1}`}
                    value={example}
                    onChange={(e) => handleExampleChange(index, e.target.value)}
                    rows={2}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExample(index)}
                    className="mt-1"
                    disabled={wordData.examples.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addExample}
                className="w-full mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Example
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Difficulty Level</Label>
              <Select 
                value={wordData.level} 
                onValueChange={(value) => handleSelectChange('level', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate('/vocabulary')}
            >
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              Add Word
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
