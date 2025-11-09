import { defineEventHandler, readBody } from 'h3';
import OpenAI from 'openai';
import type { BudgetPrediction, BlurbResponse } from '../types';

const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY!,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

export default defineEventHandler(async (event) => {
  const body = await readBody<{ budgets: BudgetPrediction[] }>(event);
  const prompt = `
Generate a short summary describing the user's financial behavior and this month's budget trends:
${JSON.stringify(body.budgets, null, 2)}
`;

  const completion = await client.chat.completions.create({
    model: 'nvidia/nemotron-nano-12b-v2-vl',
    messages: [
      { role: 'system', content: 'You are a financial assistant that summarizes spending trends.' },
      { role: 'user', content: prompt },
    ],
    max_tokens: 500,
  });

  const text = completion.choices[0]?.message?.content || '';
  const response: BlurbResponse = { text };
  return response;
});
