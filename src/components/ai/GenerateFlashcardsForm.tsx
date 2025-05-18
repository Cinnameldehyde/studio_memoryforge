
"use client";

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, FileText, PlusCircle, AlertTriangle } from 'lucide-react';
import { generateFlashcardsFromDocument, type GenerateFlashcardsInput, type GeneratedFlashcard } from '@/ai/flows/generate-flashcards-flow';
import { useFlashcards } from '@/hooks/use-flashcards';

const generateSchema = z.object({
  document: z.instanceof(FileList).refine(files => files.length > 0, "Document is required."),
  numQuestions: z.coerce.number().min(1, "At least 1 question.").max(20, "Maximum 20 questions."),
  answerLength: z.enum(['short', 'medium', 'detailed']),
});

type GenerateFormValues = z.infer<typeof generateSchema>;

export function GenerateFlashcardsForm() {
  const { toast } = useToast();
  const { addFlashcard: addCardToUserCollection } = useFlashcards();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCards, setGeneratedCards] = useState<GeneratedFlashcard[]>([]);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<GenerateFormValues>({
    resolver: zodResolver(generateSchema),
    defaultValues: {
      numQuestions: 5,
      answerLength: 'medium',
    },
  });

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const onSubmit = async (data: GenerateFormValues) => {
    setIsLoading(true);
    setGeneratedCards([]);
    setError(null);

    if (!data.document || data.document.length === 0) {
      toast({ title: 'Error', description: 'Please select a document to upload.', variant: 'destructive' });
      setIsLoading(false);
      return;
    }

    const file = data.document[0];
    if (file.type !== 'text/plain') {
      toast({ title: 'Error', description: 'Currently, only .txt files are supported.', variant: 'destructive' });
      setIsLoading(false);
      return;
    }

    try {
      const documentContent = await readFileAsText(file);
      const input: GenerateFlashcardsInput = {
        documentContent,
        numQuestions: data.numQuestions,
        answerLength: data.answerLength,
      };
      
      const result = await generateFlashcardsFromDocument(input);
      setGeneratedCards(result.flashcards);
      toast({ title: 'Success!', description: `${result.flashcards.length} flashcards generated.` });
    } catch (e: any) {
      console.error("Error generating flashcards:", e);
      setError(e.message || 'Failed to generate flashcards. The AI might be busy or the content unsuitable.');
      toast({ title: 'Generation Failed', description: e.message || 'An unexpected error occurred.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCardToCollection = (card: GeneratedFlashcard) => {
    addCardToUserCollection(card.question, card.answer);
    toast({ title: 'Flashcard Added', description: `"${card.question}" added to your collection.` });
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <FileText className="mr-2 h-6 w-6 text-primary" /> Document Upload & Specifications
        </CardTitle>
        <CardDescription>Upload a .txt file and set your preferences for flashcard generation.</CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="document-upload" className="text-base">Upload Document (.txt only)</Label>
            <Input
              id="document-upload"
              type="file"
              accept=".txt"
              className="mt-1 block w-full text-sm text-slate-500 h-12 file:mr-4 file:py-3 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              {...form.register('document')}
            />
            {form.formState.errors.document && (
              <p className="mt-1 text-sm text-destructive">{form.formState.errors.document.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="numQuestions" className="text-base">Number of Flashcards</Label>
              <Input
                id="numQuestions"
                type="number"
                className="mt-1"
                {...form.register('numQuestions')}
              />
              {form.formState.errors.numQuestions && (
                <p className="mt-1 text-sm text-destructive">{form.formState.errors.numQuestions.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="answerLength" className="text-base">Answer Length</Label>
              <Controller
                name="answerLength"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="answerLength" className="mt-1">
                      <SelectValue placeholder="Select answer length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (1-2 sentences)</SelectItem>
                      <SelectItem value="medium">Medium (1 paragraph)</SelectItem>
                      <SelectItem value="detailed">Detailed (multiple sentences/points)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch space-y-4">
          <Button type="submit" disabled={isLoading} className="w-full bg-primary">
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-5 w-5" />
            )}
            Generate Flashcards
          </Button>
          {error && (
            <div className="mt-4 flex items-center rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertTriangle className="mr-2 h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </CardFooter>
      </form>

      {generatedCards.length > 0 && (
        <div className="mt-8 p-6 border-t">
          <h3 className="text-xl font-semibold mb-4 text-primary">Generated Flashcards</h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {generatedCards.map((card, index) => (
              <Card key={index} className="bg-card/70">
                <CardHeader>
                  <CardTitle className="text-lg">Q: {card.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-card-foreground">A: {card.answer}</p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddCardToCollection(card)}
                    className="ml-auto border-primary text-primary hover:bg-primary/10"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add to My Collection
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
