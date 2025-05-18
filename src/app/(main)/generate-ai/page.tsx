
"use client";

import { PageHeader } from '@/components/shared/PageHeader';
import { GenerateFlashcardsForm } from '@/components/ai/GenerateFlashcardsForm';

export default function GenerateAiPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Flashcard Generator"
        description="Upload a text document and let AI create flashcards for you."
      />
      <GenerateFlashcardsForm />
    </div>
  );
}
