
'use server';
/**
 * @fileOverview AI flow for generating flashcards from document content.
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
  answerLength: z.enum(['short', 'medium', 'detailed']).describe('The desired length/detail for the answers (short, medium, or detailed).'),
});
export type GenerateFlashcardsInput = z.infer<typeof GenerateFlashcardsInputSchema>;

const GeneratedFlashcardSchema = z.object({
  question: z.string().describe('The question for the flashcard.'),
  answer: z.string().describe('The answer to the flashcard question.'),
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
  prompt: `You are an expert flashcard creator. Your task is to generate a set of flashcards based on the provided document content.

Document Content:
\`\`\`
{{{documentContent}}}
\`\`\`

Please generate exactly {{{numQuestions}}} flashcards.
For each flashcard, provide a question and an answer.
The length of the answers should be '{{{answerLength}}}'.
- If 'short', the answer should be 1-2 concise sentences.
- If 'medium', the answer should be a single paragraph, about 3-5 sentences.
- If 'detailed', the answer should be more comprehensive, potentially multiple sentences or a few bullet points.

Focus on key concepts, definitions, important facts, and main ideas from the document. Ensure questions are clear and answers are accurate based on the document.
Return the flashcards as an array of objects, where each object has a "question" field and an "answer" field.
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
      // Fallback if structured output isn't perfect or parsing fails
      // This part is a basic fallback, more robust error handling might be needed
      console.warn("AI output was not in the expected structured format or was empty.");
      // Try to parse unstructured text as a last resort, or return empty
      // This is a simplified example; real-world might try to extract from text()
      // For now, we'll return empty if the structured output fails.
      return { flashcards: [] };
    }
    return output;
  }
);
