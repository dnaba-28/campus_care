'use server';
/**
 * @fileOverview Realtime SOS Analyzer Genkit flow.
 *
 * - analyzeSosReport - Analyzes audio SOS reports and suggests optimal resource allocation.
 * - AnalyzeSosReportInput - Input type for the analyzeSosReport function.
 * - AnalyzeSosReportOutput - Return type for the analyzeSosReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const AnalyzeSosReportInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      'Audio data URI of the SOS report, must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
});

export type AnalyzeSosReportInput = z.infer<typeof AnalyzeSosReportInputSchema>;

const AnalyzeSosReportOutputSchema = z.object({
  analysis: z.string().describe('Analysis of the SOS report and suggested resource allocation.'),
});

export type AnalyzeSosReportOutput = z.infer<typeof AnalyzeSosReportOutputSchema>;

export async function analyzeSosReport(input: AnalyzeSosReportInput): Promise<AnalyzeSosReportOutput> {
  return analyzeSosReportFlow(input);
}

const analyzeSosReportPrompt = ai.definePrompt({
  name: 'analyzeSosReportPrompt',
  input: {schema: AnalyzeSosReportInputSchema},
  output: {schema: AnalyzeSosReportOutputSchema},
  prompt: `You are an expert campus safety administrator. You will listen to an audio SOS report and analyze the content to determine the nature of the emergency and suggest the best course of action for resource allocation. Provide clear and concise recommendations.

Audio Report: {{media url=audioDataUri}}`,
});

const analyzeSosReportFlow = ai.defineFlow(
  {
    name: 'analyzeSosReportFlow',
    inputSchema: AnalyzeSosReportInputSchema,
    outputSchema: AnalyzeSosReportOutputSchema,
  },
  async input => {
    const {output} = await analyzeSosReportPrompt(input);
    return output!;
  }
);
