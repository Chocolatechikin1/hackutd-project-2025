export interface UserData {
  name: string;
  income: number;
  expenses: number[];
  savings: number;
}

export interface Transaction {
  amount: number;
  category: string;
  date: string;
}

export interface AccountSummary {
  balance: number;
  totalPurchases: number;
  totalSavings: number;
  transactions: Transaction[];
}

export interface BudgetPrediction {
  category: string;
  predictedSpend: number;
  budgetLimit: number;
}

export interface BlurbResponse {
  text: string;
}

export interface OrchestratorResponse {
  budgets: BudgetPrediction[];
  blurb: string;
}
