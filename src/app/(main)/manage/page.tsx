"use client";

import { PageHeader } from '@/components/shared/PageHeader';
import { AddFlashcardForm } from '@/components/flashcards/AddFlashcardForm';
import { FlashcardList } from '@/components/flashcards/FlashcardList';
import { useFlashcards } from '@/hooks/use-flashcards';
import { Loader2 } from 'lucide-react';

export default function ManageCardsPage() {
  const { flashcards, isLoading } = useFlashcards();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Manage Your Flashcards"
        description="Create, edit, or delete your flashcards here."
        actionButton={<AddFlashcardForm />}
      />
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <FlashcardList flashcards={flashcards} />
      )}
    </div>
  );
}
