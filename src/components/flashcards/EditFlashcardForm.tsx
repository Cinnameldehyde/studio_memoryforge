"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useFlashcards } from '@/hooks/use-flashcards';
import type { Flashcard } from '@/lib/types';
import React from 'react';

const flashcardSchema = z.object({
  question: z.string().min(1, "Question cannot be empty.").max(500, "Question is too long."),
  answer: z.string().min(1, "Answer cannot be empty.").max(1000, "Answer is too long."),
});

type FlashcardFormValues = z.infer<typeof flashcardSchema>;

interface EditFlashcardFormProps {
  card: Flashcard;
  children: React.ReactNode; // Trigger element
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

export function EditFlashcardForm({ card, children, onOpenChange, open: controlledOpen }: EditFlashcardFormProps) {
  const { updateFlashcardContent } = useFlashcards();
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = controlledOpen !== undefined && onOpenChange ? onOpenChange : setInternalOpen;


  const form = useForm<FlashcardFormValues>({
    resolver: zodResolver(flashcardSchema),
    defaultValues: {
      question: card.question,
      answer: card.answer,
    },
  });
  
  React.useEffect(() => {
    if (card) {
      form.reset({
        question: card.question,
        answer: card.answer,
      });
    }
  }, [card, form, isOpen]);


  const onSubmit = (data: FlashcardFormValues) => {
    updateFlashcardContent(card.id, data.question, data.answer);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Flashcard</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Question</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-[100px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Answer</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-[100px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              </DialogClose>
              <Button type="submit" className="bg-primary">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
