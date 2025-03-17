
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WordList } from "@/components/vocabulary/WordList";
import { BookOpen, Plus } from "lucide-react";

const Vocabulary = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            Vocabulary Collection
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and review your vocabulary words
          </p>
        </div>
        <Button onClick={() => navigate("/vocabulary/add")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Word
        </Button>
      </div>
      
      <WordList />
    </div>
  );
};

export default Vocabulary;
