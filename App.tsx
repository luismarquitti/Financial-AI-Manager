
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import type { FinancialAnalysis, AiSummary, Transaction } from './types';
import { DataInput } from './components/DataInput';
import { Dashboard } from './components/Dashboard';
import { TransactionsPage } from './pages/TransactionsPage';
import { ImportPage } from './pages/ImportPage';
import { SettingsPage } from './pages/SettingsPage';
import { TransactionModal } from './components/TransactionModal';
import { parseFile } from './utils/fileParser';
import { analyzeTransactions } from './utils/dataAnalyzer';
import { getFinancialSummary } from './services/geminiService';
import * as api from './services/apiService';
import { DatabaseIcon, HeaderIcon, ImportIcon, SettingsIcon } from './components/Icons';
import { clearAllCache } from './utils/cache';

type Page = 'input' | 'dashboard' | 'transactions' | 'import' | 'settings';

const App: React.FC = () => {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [stagedTransactions, setStagedTransactions] = useState<Transaction[]>([]);
  
  const [accounts, setAccounts] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [selectedDbAccount, setSelectedDbAccount] = useState<string>('All Accounts');
  const [aiSummary, setAiSummary] = useState<AiSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState<Page>('input');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  
  const [isInitialized, setIsInitialized] = useState(false);

  const handleReset = () => {
    setAllTransactions([]);
    setStagedTransactions([]);
    setAccounts([]);
    setCategories([]);
    setSelectedDbAccount('All Accounts');
    setAiSummary(null);
    setError(null);
    setIsLoading(false);
    setIsAiLoading(false);
    setCurrentPage('input');
    setIsInitialized(false);
    clearAllCache();
  };
  
  const resetForNewData = () => {
    setAllTransactions([]);
    setAccounts([]);
    setCategories([]);
    setSelectedDbAccount('All Accounts');
    setAiSummary(null);
    setError(null);
  };

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);
    setIsLoading(true);
    try {
      const transactions = await parseFile(file);
      if (transactions.length === 0) {
        throw new Error("No valid transactions found in the file. Please check the format and content.");
      }
      setStagedTransactions(transactions);
      setCurrentPage('import');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to parse file.');
      setCurrentPage('input');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleFetchFromDb = useCallback(async () => {
    resetForNewData();
    setIsLoading(true);

    try {
        const [fetchedTransactions, fetchedCategories, fetchedAccounts] = await Promise.all([
          api.fetchTransactionsFromDb(),
          api.fetchCategories(),
          api.fetchAccounts()
        ]);

        if (fetchedTransactions.length === 0) {
          setError("No transactions found in the database. Add some transactions or import a file to get started.");
        }

        setAllTransactions(fetchedTransactions);
        setCategories(fetchedCategories);
        setAccounts(fetchedAccounts);
        
        setSelectedDbAccount('All Accounts');

        setCurrentPage('dashboard');
        setIsInitialized(true);
        
        if(fetchedTransactions.length > 0) {
          setIsAiLoading(true);
          const summary = await getFinancialSummary(fetchedTransactions);
          setAiSummary(summary);
        }
    } catch(e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during processing.';
        setError(errorMessage);
        setCurrentPage('input');
    } finally {
        setIsLoading(false);
        setIsAiLoading(false);
    }
  }, []);

  useEffect(() => {
    // Re-run analysis if transactions change
    if (isInitialized && allTransactions.length > 0) {
      const fetchAiSummary = async () => {
        setIsAiLoading(true);
        try {
          const summary = await getFinancialSummary(allTransactions);
          setAiSummary(summary);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred while fetching AI summary.';
            console.error("Failed to refetch AI summary:", errorMessage);
        } finally {
            setIsAiLoading(false);
        }
      };
      fetchAiSummary();
    }
  }, [allTransactions, isInitialized]);

    // CRUD operations
  const handleSaveStagedTransactions = useCallback(async (transactionsToSave: Transaction[]) => {
      setIsLoading(true);
      setError(null);
      try {
          await api.saveTransactionsToDb(transactionsToSave);
          // Refetch everything to get the latest state
          await handleFetchFromDb(); 
          setCurrentPage('dashboard');
      } catch (e) {
          const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred saving transactions.';
          setError(errorMessage);
      } finally {
          setIsLoading(false);
      }
  }, [handleFetchFromDb]);

  const handleOpenModal = (transaction: Transaction | null) => {
    setTransactionToEdit(transaction);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setTransactionToEdit(null);
    setIsModalOpen(false);
  };

  const handleSaveTransaction = useCallback(async (transactionData: Omit<Transaction, 'id'>) => {
    setIsLoading(true);
    try {
        if (transactionToEdit) {
            await api.updateTransaction({ ...transactionData, id: transactionToEdit.id });
        } else {
            await api.addTransaction(transactionData);
        }
        
        const [fetchedTransactions, fetchedCategories, fetchedAccounts] = await Promise.all([
          api.fetchTransactionsFromDb(),
          api.fetchCategories(),
          api.fetchAccounts()
        ]);
        setAllTransactions(fetchedTransactions);
        setCategories(fetchedCategories);
        setAccounts(fetchedAccounts);

        handleCloseModal();
    } catch(e) {
        console.error("Failed to save transaction", e);
    } finally {
        setIsLoading(false);
    }
  }, [transactionToEdit]);

  const handleDeleteTransaction = useCallback(async (transactionId: string) => {
      if (!window.confirm("Are you sure you want to delete this transaction?")) return;
      
      setIsLoading(true);
      try {
          await api.deleteTransaction(transactionId);
          setAllTransactions(prev => prev.filter(t => t.id !== transactionId));
      } catch (e) {
          console.error("Failed to delete transaction", e);
      } finally {
          setIsLoading(false);
      }
  }, []);

  const createSettingHandler = (
    addFunc: (name: string) => Promise<void>,
    updateFunc: (oldName: string, newName: string) => Promise<void>,
    deleteFunc: (name: string) => Promise<void>,
    setData: React.Dispatch<React.SetStateAction<string[]>>,
    fetchData: () => Promise<string[]>
  ) => {
    const handleAdd = async (name: string) => {
      await addFunc(name);
      setData(await fetchData());
    };
    const handleUpdate = async (oldName: string, newName: string) => {
      await updateFunc(oldName, newName);
      setData(await fetchData());
      setAllTransactions(await api.fetchTransactionsFromDb());
    };
    const handleDelete = async (name: string) => {
      await deleteFunc(name);
      setData(await fetchData());
      setAllTransactions(await api.fetchTransactionsFromDb());
    };
    return { handleAdd, handleUpdate, handleDelete };
  };

  const categoryHandlers = createSettingHandler(api.addCategory, api.updateCategory, api.deleteCategory, setCategories, api.fetchCategories);
  const accountHandlers = createSettingHandler(api.addAccount, api.updateAccount, api.deleteAccount, setAccounts, api.fetchAccounts);

  const financialAnalysis = useMemo<FinancialAnalysis | null>(() => {
    if (allTransactions.length === 0) return null;
    const filteredTransactions = selectedDbAccount === 'All Accounts'
      ? allTransactions
      : allTransactions.filter(t => t.account === selectedDbAccount);
    return analyzeTransactions(filteredTransactions);
  }, [allTransactions, selectedDbAccount]);
  
  const dbAccounts = useMemo(() => ['All Accounts', ...accounts], [accounts]);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard 
          analysis={financialAnalysis} 
          aiSummary={aiSummary}
          isLoading={isLoading}
          isAiLoading={isAiLoading}
          accounts={dbAccounts}
          selectedAccount={selectedDbAccount}
          onAccountChange={setSelectedDbAccount}
        />;
      case 'transactions':
          return <TransactionsPage 
            transactions={allTransactions}
            onAdd={() => handleOpenModal(null)}
            onEdit={handleOpenModal}
            onDelete={handleDeleteTransaction}
            categories={categories}
            accounts={accounts}
          />;
      case 'import':
        return <ImportPage 
          stagedTransactions={stagedTransactions}
          setStagedTransactions={setStagedTransactions}
          onSave={handleSaveStagedTransactions}
          onCancel={() => setCurrentPage(isInitialized ? 'dashboard' : 'input')}
          isLoading={isLoading}
          categories={categories}
          accounts={accounts}
        />;
      case 'settings':
        return <SettingsPage 
          categories={categories}
          accounts={accounts}
          onAddCategory={categoryHandlers.handleAdd}
          onUpdateCategory={categoryHandlers.handleUpdate}
          onDeleteCategory={categoryHandlers.handleDelete}
          onAddAccount={accountHandlers.handleAdd}
          onUpdateAccount={accountHandlers.handleUpdate}
          onDeleteAccount={accountHandlers.handleDelete}
        />;
      case 'input':
      default:
        return <DataInput onFileSelect={handleFileSelect} onFetchFromDb={handleFetchFromDb} isLoading={isLoading} />;
    }
  };

  const NavButton: React.FC<{ page: Page; label: string; icon: React.ReactNode }> = ({ page, label, icon }) => (
    <button
        onClick={() => setCurrentPage(page)}
        disabled={!isInitialized && page !== 'input'}
        className={`flex flex-col items-center justify-center text-center px-3 py-2 rounded-lg transition-colors duration-200 w-24
            ${currentPage === page ? 'bg-primary text-white' : 'text-gray-500 hover:bg-indigo-100 hover:text-primary'}
            ${!isInitialized && page !== 'input' ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        {icon}
        <span className="text-xs font-medium mt-1">{label}</span>
    </button>
  );

  return (
    <div className="bg-background min-h-screen text-text-primary font-sans flex">
      <aside className="w-28 bg-white shadow-md flex flex-col items-center py-6 space-y-6">
        <div className="flex items-center gap-2 flex-col">
            <HeaderIcon/>
            <h1 className="text-sm font-bold text-center text-primary">Fin-AI</h1>
        </div>
        <nav className="flex flex-col items-center space-y-4">
             <NavButton page="dashboard" label="Dashboard" icon={<DatabaseIcon className="w-5 h-5"/>}/>
             <NavButton page="transactions" label="Transactions" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>}/>
             <NavButton page="import" label="Import" icon={<ImportIcon/>}/>
             <NavButton page="settings" label="Settings" icon={<SettingsIcon/>}/>
        </nav>
        <div className="mt-auto">
            <button onClick={handleReset} className="text-gray-400 hover:text-danger text-xs flex flex-col items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                Reset
            </button>
        </div>
      </aside>
      
      <main className="flex-1 p-8 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto">
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}
            {renderPage()}
        </div>
      </main>
      
      {isModalOpen && (
        <TransactionModal 
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSaveTransaction}
            transaction={transactionToEdit}
            categories={categories}
            accounts={accounts}
        />
      )}
    </div>
  );
};

export default App;
