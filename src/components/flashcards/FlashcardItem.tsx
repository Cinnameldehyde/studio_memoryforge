
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FlashcardItemProps {
  question: string;
  answer: string;
  onFlip?: (isFlipped: boolean) => void;
}

export function FlashcardItem({ question, answer, onFlip }: FlashcardItemProps) {
  const [hasBeenFlippedThisSession, setHasBeenFlippedThisSession] = useState(false);

  // Effect to call onFlip when hasBeenFlippedThisSession changes.
  // This ensures the parent (ReviewPage) is notified to show/hide rating buttons.
  useEffect(() => {
    if (onFlip) {
      onFlip(hasBeenFlippedThisSession);
    }
  }, [hasBeenFlippedThisSession, onFlip]);

  const handleMouseEnter = () => {
    if (!hasBeenFlippedThisSession) {
      setHasBeenFlippedThisSession(true);
    }
  };

  // When the 'key' prop changes in ReviewPage (new card), this component remounts,
  // and hasBeenFlippedThisSession resets to false automatically.

  return (
    <div 
      className="perspective w-full max-w-xl mx-auto h-80 md:h-96"
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleMouseEnter} // Added for touch devices to trigger flip on first touch
    >
      <Card
        className={cn(
          "relative w-full h-full shadow-xl transition-transform duration-700 transform-style-preserve-3d",
          hasBeenFlippedThisSession ? 'rotate-y-180' : ''
        )}
        aria-label={hasBeenFlippedThisSession ? `Showing answer: ${answer}` : `Showing question: ${question}. Hover or tap to reveal answer.`}
      >
        {/* Front of the card */}
        <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-6 bg-card rounded-lg border">
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Question</p>
            <p className="text-xl md:text-2xl font-semibold text-card-foreground">{question}</p>
          </CardContent>
        </div>

        {/* Back of the card */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-6 bg-card rounded-lg border">
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Answer</p>
            <p className="text-xl md:text-2xl font-semibold text-card-foreground">{answer}</p>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
