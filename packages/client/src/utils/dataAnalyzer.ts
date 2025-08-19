
import type { FinancialAnalysis, MonthlySummary, CategorySummary } from '../types';

// The input here is the mapped transaction type for analysis
type AnalyzableTransaction = {
  id: string;
  date: Date;
  description: string;
  amount: number;
  category?: string;
  account?: string;
};

export const analyzeTransactions = (transactions: AnalyzableTransaction[]): FinancialAnalysis => {
  let totalIncome = 0;
  let totalExpenses = 0;
  const monthlyData: { [key: string]: { income: number, expenses: number } } = {};
  const categoryData: { [key: string]: number } = {};

  for (const t of transactions) {
    if (t.amount > 0) {
      totalIncome += t.amount;
    } else {
      totalExpenses += t.amount;
      const category = t.category || 'Uncategorized';
      categoryData[category] = (categoryData[category] || 0) + Math.abs(t.amount);
    }
    
    const monthKey = `${t.date.getFullYear()}-${String(t.date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expenses: 0 };
    }
    if (t.amount > 0) {
      monthlyData[monthKey].income += t.amount;
    } else {
      monthlyData[monthKey].expenses += Math.abs(t.amount);
    }
  }

  const monthlySummaries: MonthlySummary[] = Object.keys(monthlyData)
    .sort()
    .map(key => ({
      month: new Date(key + '-02').toLocaleString('default', { month: 'short', year: '2-digit' }),
      income: monthlyData[key].income,
      expenses: monthlyData[key].expenses,
    }));
  
  const categorySummaries: CategorySummary[] = Object.keys(categoryData)
    .map(name => ({
      name,
      value: categoryData[name],
    }))
    .sort((a, b) => b.value - a.value);

  return {
    totalIncome,
    totalExpenses,
    netSavings: totalIncome + totalExpenses,
    monthlySummaries,
    categorySummaries,
    transactions,
  };
};