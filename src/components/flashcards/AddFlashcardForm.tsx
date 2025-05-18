
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useFlashcards } from '@/hooks/use-flashcards';
import { PlusCircle } from 'lucide-react';
import React from 'react';

const flashcardSchema = z.object({
  question: z.string().min(1, "Question cannot be empty.").max(500, "Question is too long."),
  answer: z.string().min(1, "Answer cannot be empty.").max(1000, "Answer is too long."),
});

type FlashcardFormValues = z.infer<typeof flashcardSchema>;

interface AddFlashcardFormProps {
  triggerButton?: React.ReactNode; // Optional custom trigger
}

export function AddFlashcardForm({ triggerButton }: AddFlashcardFormProps) {
  const { addFlashcard } = useFlashcards();
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<FlashcardFormValues>({
    resolver: zodResolver(flashcardSchema),
    defaultValues: {
      question: "",
      answer: "",
    },
  });

  const onSubmit = (data: FlashcardFormValues) => {
    addFlashcard(data.question, data.answer);
    form.reset();
    setIsOpen(false); // Close dialog on successful submission
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton ? triggerButton : (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Flashcard
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Flashcard</DialogTitle>
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
                    <Textarea placeholder="e.g., What is the capital of France?" {...field} className="min-h-[100px]" />
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
                    <Textarea placeholder="e.g., Paris" {...field} className="min-h-[100px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                 <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" className="bg-primary">Add Flashcard</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
