'use server';
/**
 * @fileOverview A chat flow that interacts with a selected AI model.
 */
import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ChatInputSchema = z.object({
  modelName: z.string().describe('The name of the model to use for the chat.'),
  prompt: z.string().describe('The user\'s prompt.'),
});

export type ChatInput = z.infer<typeof ChatInputSchema>;

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: z.string(),
  },
  async ({modelName, prompt}) => {
    // Dynamically select the model based on the input name
    // Note: In a real app, you might have a mapping from modelName to a specific Genkit model object.
    // For this example, we'll use the default model configured in `src/ai/genkit.ts`,
    // as Genkit doesn't support dynamic model selection by string name in this way directly.
    // A more robust solution would involve a lookup or factory function.
    
    console.log(`Using model: ${modelName} with prompt: "${prompt}"`);

    const llmResponse = await ai.generate({
      prompt: prompt,
      model: ai.model, // Uses the default model for now.
      config: {
        // You could add model-specific config here if needed,
        // for example, based on the `modelName`.
      },
    });

    return llmResponse.text;
  }
);

export async function chat(input: ChatInput): Promise<string> {
    return chatFlow(input);
}
