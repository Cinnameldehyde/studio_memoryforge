
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FlashcardItem } from '@/components/flashcards/FlashcardItem';
import { Button } from '@/components/ui/button';
import { useFlashcards } from '@/hooks/use-flashcards';
import type { Flashcard, Rating } from '@/lib/types';
import { ThumbsUp, ThumbsDown, Loader2, CheckCheck } from 'lucide-react';
import Link from 'next/link';

export default function ReviewPage() {
  const { getNextDueCard, rateFlashcard, isLoading: flashcardsLoading, stats } = useFlashcards();
  const [currentCard, setCurrentCard] = useState<Flashcard | undefined>(undefined);
  const [isFlipped, setIsFlipped] = useState(false);
  const [key, setKey] = useState(0); // To force re-render of FlashcardItem

  useEffect(() => {
    if (!flashcardsLoading) {
      setCurrentCard(getNextDueCard());
      setIsFlipped(false); // Reset flip state when card changes
      setKey(prevKey => prevKey + 1); // Change key to remount FlashcardItem
    }
  }, [flashcardsLoading, getNextDueCard, stats.dueToday]); // Re-fetch when dueToday changes


  const handleRateCard = (rating: Rating) => {
    if (currentCard) {
      rateFlashcard(currentCard.id, rating);
      // The useEffect will fetch the next card due to stats.dueToday dependency change
    }
  };
  
  const handleCardFlipped = (flipped: boolean) => {
    setIsFlipped(flipped);
  };

  if (flashcardsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading your cards...</p>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Review Session"
          description="Time to test your knowledge!"
        />
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card p-12 text-center min-h-[300px] shadow-sm">
          <CheckCheck className="h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">All caught up!</h2>
          <p className="text-muted-foreground mb-6">You have no cards due for review right now. Great job!</p>
          <Link href="/manage" passHref>
            <Button variant="default">Manage Cards</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 flex flex-col items-center">
      <PageHeader 
        title="Review Session"
        description={`Cards due: ${stats.dueToday}. Sharpen your memory!`}
      />
      
      <FlashcardItem 
        key={key} // Force re-render when card changes
        question={currentCard.question} 
        answer={currentCard.answer}
        onFlip={handleCardFlipped}
      />

      {isFlipped && (
        <div className="flex gap-4 mt-6 animate-in fade-in duration-500">
          <Button 
            variant="outline" 
            size="lg" 
            className="bg-red-500 hover:bg-red-600 text-white border-red-600 hover:border-red-700 min-w-[150px] shadow-md transition-all hover:shadow-lg"
            onClick={() => handleRateCard(1)} // 1 for "Don't Know" (maps to quality < 3)
            aria-label="I don't know this card"
          >
            <ThumbsDown className="mr-2 h-5 w-5" /> Don&apos;t Know
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="bg-green-500 hover:bg-green-600 text-white border-green-600 hover:border-green-700 min-w-[150px] shadow-md transition-all hover:shadow-lg"
            onClick={() => handleRateCard(4)} // 4 for "Know" (maps to quality >=3)
             aria-label="I know this card"
          >
            <ThumbsUp className="mr-2 h-5 w-5" /> Know
          </Button>
        </div>
      )}
       {!isFlipped && (
        <p className="mt-6 text-muted-foreground animate-pulse">Click the card to reveal the answer.</p>
      )}
    </div>
  );
}
