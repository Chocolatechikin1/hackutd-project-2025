import { defineEventHandler } from 'h3';
import type { AccountSummary } from '../types';

const NESSIE_API_KEY = process.env.NESSIE_API_KEY!;
const BASE_URL = 'http://api.nessieisreal.com';

export default defineEventHandler(async () => {
  const customerId = 'YOUR_CUSTOMER_ID'; // Replace dynamically if needed
  const accountsRes = await fetch(`${BASE_URL}/customers/${customerId}/accounts?key=${NESSIE_API_KEY}`);
  const accounts = await accountsRes.json();

  const purchasesRes = await fetch(`${BASE_URL}/customers/${customerId}/purchases?key=${NESSIE_API_KEY}`);
  const purchases = await purchasesRes.json();

  const savingsRes = await fetch(`${BASE_URL}/customers/${customerId}/deposits?key=${NESSIE_API_KEY}`);
  const savings = await savingsRes.json();

  const totalPurchases = purchases.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
  const totalSavings = savings.reduce((sum: number, s: any) => sum + (s.amount || 0), 0);

  const summary: AccountSummary = {
    balance: accounts[0]?.balance || 0,
    totalPurchases,
    totalSavings,
    transactions: purchases.map((p: any) => ({
      amount: p.amount,
      category: p.purchase_category,
      date: p.purchase_date,
    })),
  };

  return summary;
});
