import type { Transaction } from '../types';

interface RawDbTransaction {
    Date: string;
    Description: string;
    Amount: number;
    Category: string;
    Account: string;
}

// In-memory store to simulate a persistent database. It starts empty and is populated on first access.
let mockDbTransactions: (Omit<Transaction, 'id' | 'date'> & { date: string; id: string })[] = [];
let mockCategories: string[] = [];
let mockAccounts: string[] = [];

let initializationPromise: Promise<void> | null = null;

const initializeDb = () => {
    if (!initializationPromise) {
        initializationPromise = (async () => {
            try {
                const response = await fetch('/data/transactions.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const rawTransactions: RawDbTransaction[] = await response.json();
                
                mockDbTransactions = rawTransactions.map((t, index: number) => ({
                    id: `tx-${index + 1}`,
                    date: t.Date,
                    description: t.Description,
                    amount: t.Amount,
                    category: t.Category,
                    account: t.Account
                }));

                const getUnique = (arr: (string | undefined)[]): string[] => [...new Set(arr.filter(Boolean) as string[])].sort();
                mockCategories = getUnique(mockDbTransactions.map(t => t.category));
                mockAccounts = getUnique(mockDbTransactions.map(t => t.account));
            } catch (error) {
                console.error("Failed to initialize database from JSON:", error);
                // Reset promise on failure to allow retry
                initializationPromise = null; 
                throw new Error("Could not load initial transaction data. Please check the console for more details.");
            }
        })();
    }
    return initializationPromise;
};


const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const fetchTransactionsFromDb = async (): Promise<Transaction[]> => {
    await initializeDb();
    await delay(500);
    return mockDbTransactions.map(t => ({
        ...t,
        // Treat date string as local time to avoid timezone issues
        date: new Date(t.date + 'T00:00:00'),
    }));
};

export const fetchCategories = async (): Promise<string[]> => {
    await initializeDb();
    await delay(100);
    return [...mockCategories];
};

export const fetchAccounts = async (): Promise<string[]> => {
    await initializeDb();
    await delay(100);
    return [...mockAccounts];
};

export const saveTransactionsToDb = async (transactionsToSave: Transaction[]): Promise<void> => {
    await initializeDb();
    await delay(1000);
    const newTransactions = transactionsToSave.map(t => ({
        ...t,
        id: t.id.startsWith('new-') ? `${Date.now()}-${Math.random()}` : t.id,
        date: t.date.toISOString().split('T')[0]
    }));
    mockDbTransactions.push(...newTransactions);
};

export const addTransaction = async (transactionData: Omit<Transaction, 'id'>): Promise<Transaction> => {
    await initializeDb();
    await delay(300);
    const newTransaction: Transaction = {
        ...transactionData,
        id: `${Date.now()}-${Math.random()}`,
    };
    mockDbTransactions.push({...newTransaction, date: newTransaction.date.toISOString().split('T')[0]});
    return newTransaction;
};

export const updateTransaction = async (transaction: Transaction): Promise<Transaction> => {
    await initializeDb();
    await delay(300);
    const index = mockDbTransactions.findIndex(t => t.id === transaction.id);
    if (index === -1) throw new Error("Transaction not found");
    mockDbTransactions[index] = {...transaction, date: transaction.date.toISOString().split('T')[0]};
    return transaction;
};

export const deleteTransaction = async (transactionId: string): Promise<void> => {
    await initializeDb();
    await delay(300);
    mockDbTransactions = mockDbTransactions.filter(t => t.id !== transactionId);
};

const updateRelatedTransactions = (type: 'category' | 'account', oldName: string, newName: string | undefined) => {
    mockDbTransactions = mockDbTransactions.map(t => {
        if (t[type] === oldName) {
            return { ...t, [type]: newName };
        }
        return t;
    });
};

export const addCategory = async (name: string): Promise<void> => {
    await initializeDb();
    await delay(200);
    if (mockCategories.includes(name)) throw new Error("Category already exists");
    mockCategories.push(name);
    mockCategories.sort();
};

export const updateCategory = async (oldName: string, newName: string): Promise<void> => {
    await initializeDb();
    await delay(200);
    const index = mockCategories.findIndex(c => c === oldName);
    if (index === -1) throw new Error("Category not found");
    if (mockCategories.includes(newName)) throw new Error("New category name already exists");
    mockCategories[index] = newName;
    mockCategories.sort();
    updateRelatedTransactions('category', oldName, newName);
};

export const deleteCategory = async (name: string): Promise<void> => {
    await initializeDb();
    await delay(200);
    mockCategories = mockCategories.filter(c => c !== name);
    updateRelatedTransactions('category', name, 'Uncategorized');
};

export const addAccount = async (name: string): Promise<void> => {
    await initializeDb();
    await delay(200);
    if (mockAccounts.includes(name)) throw new Error("Account already exists");
    mockAccounts.push(name);
    mockAccounts.sort();
};

export const updateAccount = async (oldName: string, newName: string): Promise<void> => {
    await initializeDb();
    await delay(200);
    const index = mockAccounts.findIndex(a => a === oldName);
    if (index === -1) throw new Error("Account not found");
    if (mockAccounts.includes(newName)) throw new Error("New account name already exists");
    mockAccounts[index] = newName;
    mockAccounts.sort();
    updateRelatedTransactions('account', oldName, newName);
};

export const deleteAccount = async (name: string): Promise<void> => {
    await initializeDb();
    await delay(200);
    mockAccounts = mockAccounts.filter(a => a !== name);
    updateRelatedTransactions('account', name, undefined);
};