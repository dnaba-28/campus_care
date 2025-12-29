'use server';
/**
 * @fileOverview A campus health and safety AI assistant.
 *
 * - campusCareChat - A function that provides answers based on user queries.
 * - CampusCareChatInput - The input type for the campusCareChat function.
 * - CampusCareChatOutput - The return type for the campusCareChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CampusCareChatInputSchema = z.object({
  query: z.string().describe('The user\'s question or statement.'),
});
export type CampusCareChatInput = z.infer<typeof CampusCareChatInputSchema>;

const CampusCareChatOutputSchema = z.object({
  answer: z.string().describe('The AI\'s response to the user.'),
});
export type CampusCareChatOutput = z.infer<typeof CampusCareChatOutputSchema>;

export async function campusCareChat(input: CampusCareChatInput): Promise<CampusCareChatOutput> {
  return campusCareChatFlow(input);
}

const personaPrompt = `You are CARE-AI, a smart campus health and safety assistant for NIT Agartala.
- If the user asks about health/fever/injuries, give concise First Aid advice in markdown format.
- If the user asks about 'Mess' or 'Food', suggest they check the Cafeteria page.
- If the situation seems critical (fire, heart attack, bleeding), START your response with '🚨 EMERGENCY:' and advise them to call 112 or use the SOS button.
- Keep answers short (under 50 words) and helpful.
`;

const campusCareChatFlow = ai.defineFlow(
  {
    name: 'campusCareChatFlow',
    inputSchema: CampusCareChatInputSchema,
    outputSchema: CampusCareChatOutputSchema,
  },
  async (input) => {
    const { text } = await ai.generate({
      prompt: `${personaPrompt}

      User's question: "${input.query}"`,
    });

    return { answer: text };
  }
);
