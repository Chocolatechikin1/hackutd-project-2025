import { defineEventHandler, readBody } from 'h3';
import type { AccountSummary, BudgetPrediction } from '../types';

export default defineEventHandler(async (event) => {
  const body = await readBody<{ summary: AccountSummary }>(event);

  const res = await fetch('http://localhost:5000/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body.summary),
  });

  const predictions: BudgetPrediction[] = await res.json();
  return predictions;
});
