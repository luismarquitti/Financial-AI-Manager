
export interface Account {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  category?: Category | null;
  account?: Account | null;
}

export interface MonthlySummary {
  month: string;
  income: number;
  expenses: number;
}

export interface CategorySummary {
  name: string;
  value: number;
}

export interface FinancialAnalysis {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  monthlySummaries: MonthlySummary[];
  categorySummaries: CategorySummary[];
  transactions: (Omit<Transaction, 'category' | 'account'> & { category?: string; account?: string; })[];
}

export interface AiSummary {
  overallSummary: string;
  incomeAnalysis: string;
  expenseAnalysis: string;
  actionableInsights: string[];
}