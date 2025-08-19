
export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  category?: string;
  account?: string;
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
  transactions: Transaction[];
}

export interface AiSummary {
  overallSummary: string;
  incomeAnalysis: string;
  expenseAnalysis: string;
  actionableInsights: string[];
}