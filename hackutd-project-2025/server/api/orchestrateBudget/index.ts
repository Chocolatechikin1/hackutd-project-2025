import { defineEventHandler } from 'h3';
import OpenAI from 'openai';
import type { OrchestratorResponse, AccountSummary, BudgetPrediction } from '../types';

const azureClient = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_KEY!,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/o3`,
});

export default defineEventHandler(async () => {
  // Step 1: Get user financial data
  const summaryRes = await fetch(`${process.env.API_BASE_URL}/api/getUserData`);
  const summary: AccountSummary = await summaryRes.json();

  // Step 2: Predict budget
  const predRes = await fetch(`${process.env.API_BASE_URL}/api/predictBudget`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ summary }),
  });
  const predictions: BudgetPrediction[] = await predRes.json();

  // Step 3: Generate blurb
  const blurbRes = await fetch(`${process.env.API_BASE_URL}/api/generateBlurb`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ budgets: predictions }),
  });
  const blurbData = await blurbRes.json();

  // Step 4: Return result
  const finalResult: OrchestratorResponse = {
    budgets: predictions,
    blurb: blurbData.text,
  };

  return finalResult;
});
