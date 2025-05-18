
'use server';
/**
 * @fileOverview AI flow for generating flashcards from document content.
 * Flashcards will have very short, concise answers.
 *
 * - generateFlashcardsFromDocument - A function that handles flashcard generation.
 * - GenerateFlashcardsInput - The input type.
 * - GenerateFlashcardsOutput - The return type.
 * - GeneratedFlashcard - The type for a single generated flashcard.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateFlashcardsInputSchema = z.object({
  documentContent: z.string().describe('The full text content of the document.'),
  numQuestions: z.number().int().min(1).max(20).describe('The desired number of flashcards to generate.'),
  // answerLength removed as all answers will be short
});
export type GenerateFlashcardsInput = z.infer<typeof GenerateFlashcardsInputSchema>;

const GeneratedFlashcardSchema = z.object({
  question: z.string().describe('The question for the flashcard.'),
  answer: z.string().describe('The answer to the flashcard question, expected to be very short.'),
});
export type GeneratedFlashcard = z.infer<typeof GeneratedFlashcardSchema>;

const GenerateFlashcardsOutputSchema = z.object({
  flashcards: z.array(GeneratedFlashcardSchema).describe('An array of generated flashcards.'),
});
export type GenerateFlashcardsOutput = z.infer<typeof GenerateFlashcardsOutputSchema>;


export async function generateFlashcardsFromDocument(input: GenerateFlashcardsInput): Promise<GenerateFlashcardsOutput> {
  return generateFlashcardsFlow(input);
}

const generateFlashcardsPrompt = ai.definePrompt({
  name: 'generateFlashcardsPrompt',
  input: { schema: GenerateFlashcardsInputSchema },
  output: { schema: GenerateFlashcardsOutputSchema },
  prompt: `You are an expert flashcard creator tasked with generating extremely concise flashcards.
Your goal is to minimize resource usage by making answers as short as absolutely possible.

Document Content:
\`\`\`
{{{documentContent}}}
\`\`\`

Please generate exactly {{{numQuestions}}} flashcards.
For each flashcard, provide a question and an answer.
**All answers MUST be very short:** ideally a few keywords, a single concise phrase, or at most 1-2 very brief lines. Focus on extreme brevity and clarity.

Extract key concepts, definitions, essential facts, or main ideas from the document.
Ensure questions are clear and that the short answers are accurate based on the document.
Return the flashcards as an array of objects, where each object has a "question" field and an "answer" field.
Be as concise as possible in your responses to minimize token usage.
`,
});

const generateFlashcardsFlow = ai.defineFlow(
  {
    name: 'generateFlashcardsFlow',
    inputSchema: GenerateFlashcardsInputSchema,
    outputSchema: GenerateFlashcardsOutputSchema,
  },
  async (input) => {
    const { output } = await generateFlashcardsPrompt(input);
    if (!output || !output.flashcards) {
      console.warn("AI output was not in the expected structured format or was empty. Defaulting to empty flashcards array.");
      return { flashcards: [] };
    }
    return output;
  }
);
