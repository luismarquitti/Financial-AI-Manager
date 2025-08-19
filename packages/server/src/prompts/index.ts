
interface SimplifiedTransaction {
    date: string;
    amount: number;
    category?: string;
    description: string;
    account?: string;
}

interface TransactionToCategorize {
  id: string;
  description: string;
}

/**
 * Creates the prompt for generating a financial summary.
 * @param transactions - A simplified list of transactions for analysis.
 * @returns The complete prompt string.
 */
export const createFinancialSummaryPrompt = (transactions: SimplifiedTransaction[]): string => {
  return `
    Analyze the following financial transactions from one or more accounts.
    A positive amount indicates income, and a negative amount indicates an expense.
    Provide a concise and helpful financial summary. Consider trends across different accounts if applicable.
    
    Transactions:
    ${JSON.stringify(transactions)}
  `;
};

/**
 * Creates the prompt for suggesting transaction categories.
 * @param transactions - The list of transactions needing categorization.
 * @param categoryNames - The list of available category names to choose from.
 * @returns The complete prompt string.
 */
export const createCategorySuggestionPrompt = (transactions: TransactionToCategorize[], categoryNames: string[]): string => {
  return `
    You are an expert financial assistant. Your task is to categorize financial transactions.
    Based on the transaction description, assign the most appropriate category from the following list.
    Do not use any category that is not in this list.

    Available Categories:
    ${categoryNames.join(', ')}

    Here are the transactions to categorize. Each has a unique 'id' and a 'description'.
    For each transaction, return the original 'id' and the chosen 'categoryName'.
    
    Transactions:
    ${JSON.stringify(transactions)}
  `;
};