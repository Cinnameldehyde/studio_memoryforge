"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';

interface FlashcardItemProps {
  question: string;
  answer: string;
  onFlip?: (isFlipped: boolean) => void;
}

export function FlashcardItem({ question, answer, onFlip }: FlashcardItemProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    const newFlippedState = !isFlipped;
    setIsFlipped(newFlippedState);
    if (onFlip) {
      onFlip(newFlippedState);
    }
  };

  return (
    <div className="perspective w-full max-w-xl mx-auto h-80 md:h-96">
      <Card
        className={cn(
          "relative w-full h-full shadow-xl transition-transform duration-700 transform-style-preserve-3d cursor-pointer",
          isFlipped ? 'rotate-y-180' : ''
        )}
        onClick={handleFlip}
        role="button"
        aria-label={isFlipped ? `Showing answer: ${answer}` : `Showing question: ${question}. Click to flip.`}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleFlip();}}
      >
        {/* Front of the card */}
        <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-6 bg-card rounded-lg border">
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Question</p>
            <p className="text-xl md:text-2xl font-semibold text-card-foreground">{question}</p>
          </CardContent>
           <div className="absolute bottom-4 right-4 text-muted-foreground opacity-70">
            <RefreshCw size={18} />
          </div>
        </div>

        {/* Back of the card */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-6 bg-card rounded-lg border">
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Answer</p>
            <p className="text-xl md:text-2xl font-semibold text-card-foreground">{answer}</p>
          </CardContent>
          <div className="absolute bottom-4 right-4 text-muted-foreground opacity-70">
            <RefreshCw size={18} />
          </div>
        </div>
      </Card>
    </div>
  );
}

// Add these styles to your globals.css or a relevant CSS file for the 3D effect
/*
.perspective {
  perspective: 1000px;
}
.transform-style-preserve-3d {
  transform-style: preserve-3d;
}
.rotate-y-180 {
  transform: rotateY(180deg);
}
.backface-hidden {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
*/
// For Tailwind, you can create utility classes or use plugins for perspective and transform-style if needed,
// but inline styles for these specific properties are also acceptable for simplicity in Next.js.
// For now, let's add these to globals.css
