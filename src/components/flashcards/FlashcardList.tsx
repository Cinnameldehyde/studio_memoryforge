"use client";

import type { Flashcard } from '@/lib/types';
import { useFlashcards } from '@/hooks/use-flashcards';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit3, Trash2, RotateCcw, CalendarCheck2, AlertTriangle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { EditFlashcardForm } from './EditFlashcardForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React from 'react';

interface FlashcardListProps {
  flashcards: Flashcard[];
}

export function FlashcardListItem({ card }: { card: Flashcard }) {
  const { deleteFlashcard, resetCardProgress } = useFlashcards();
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  return (
    <Card className="shadow-md transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg truncate" title={card.question}>{card.question}</CardTitle>
        <CardDescription className="text-sm truncate" title={card.answer}>{card.answer}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="flex items-center">
            <CalendarCheck2 className="mr-2 h-3.5 w-3.5" /> 
            Due: {format(parseISO(card.dueDate), 'MMM d, yyyy')}
          </p>
          <p>Interval: {card.interval}d | Reps: {card.repetition} | EF: {card.efactor.toFixed(2)}</p>
          {card.lastReviewedAt && <p>Last Reviewed: {format(parseISO(card.lastReviewedAt), 'MMM d, yyyy HH:mm')}</p>}
          {card.isMastered && <p className="text-green-600 font-medium">Mastered</p>}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => resetCardProgress(card.id)} aria-label="Reset progress for this card">
          <RotateCcw className="h-4 w-4" />
        </Button>
        <EditFlashcardForm card={card} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <Button variant="outline" size="sm" aria-label="Edit this card">
            <Edit3 className="h-4 w-4" />
          </Button>
        </EditFlashcardForm>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" aria-label="Delete this card">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center"><AlertTriangle className="mr-2 h-5 w-5 text-destructive"/>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the flashcard: "{card.question}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteFlashcard(card.id)} className="bg-destructive hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}


export function FlashcardList({ flashcards }: FlashcardListProps) {
  if (flashcards.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p className="text-lg">No flashcards yet.</p>
        <p>Click "Add New Flashcard" to get started.</p>
      </div>
    );
  }

  // Sort cards by creation date, newest first
  const sortedFlashcards = [...flashcards].sort((a,b) => parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime());

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sortedFlashcards.map(card => (
        <FlashcardListItem key={card.id} card={card} />
      ))}
    </div>
  );
}
