
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import type { FinancialAnalysis, AiSummary, Transaction } from './types';
import { DataInput } from './components/DataInput';
import { Dashboard } from './components/Dashboard';
import { TransactionsPage } from './pages/TransactionsPage';
import { ImportPage } from './pages/ImportPage';
import { SettingsPage } from './pages/SettingsPage';
import { TransactionModal } from './components/TransactionModal';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { parseFile } from './utils/fileParser';
import { analyzeTransactions } from './utils/dataAnalyzer';
import { DatabaseIcon, HeaderIcon, ImportIcon, SettingsIcon } from './components/Icons';
import { clearAllCache } from './utils/cache';
import { 
    GET_ACCOUNTS, GET_CATEGORIES, GET_TRANSACTIONS, GET_AI_SUMMARY,
    ADD_ACCOUNT, UPDATE_ACCOUNT, DELETE_ACCOUNT,
    ADD_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY,
    ADD_TRANSACTION, UPDATE_TRANSACTION, DELETE_TRANSACTION, SAVE_TRANSACTIONS
} from './graphql/queries';

type Page = 'input' | 'dashboard' | 'transactions' | 'import' | 'settings';

const App: React.FC = () => {
  const { t } = useTranslation();
  const [stagedTransactions, setStagedTransactions] = useState<Transaction[]>([]);
  
  const [selectedDbAccount, setSelectedDbAccount] = useState<string>('All Accounts');
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState<Page>('input');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  
  const [isInitialized, setIsInitialized] = useState(false);

  // GraphQL Queries
  const { data: transactionsData, loading: transactionsLoading, error: transactionsError } = useQuery(GET_TRANSACTIONS, { skip: !isInitialized });
  const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_CATEGORIES, { skip: !isInitialized });
  const { data: accountsData, loading: accountsLoading } = useQuery(GET_ACCOUNTS, { skip: !isInitialized });
  const [getAiSummary, { data: aiSummaryData, loading: isAiLoading }] = useLazyQuery(GET_AI_SUMMARY);

  const allTransactions: Transaction[] = useMemo(() => {
    if (!transactionsData?.transactions) return [];
    return transactionsData.transactions.map((t: any) => ({ ...t, date: new Date(t.date) }));
  }, [transactionsData]);

  const categories = useMemo(() => categoriesData?.categories || [], [categoriesData]);
  const accounts = useMemo(() => accountsData?.accounts || [], [accountsData]);

  const isLoading = transactionsLoading || categoriesLoading || accountsLoading;

  // GraphQL Mutations
  const commonMutationOptions = { refetchQueries: [GET_TRANSACTIONS, GET_ACCOUNTS, GET_CATEGORIES] };
  
  const [addAccount] = useMutation(ADD_ACCOUNT, commonMutationOptions);
  const [updateAccount] = useMutation(UPDATE_ACCOUNT, commonMutationOptions);
  const [deleteAccount] = useMutation(DELETE_ACCOUNT, commonMutationOptions);
  
  const [addCategory] = useMutation(ADD_CATEGORY, commonMutationOptions);
  const [updateCategory] = useMutation(UPDATE_CATEGORY, commonMutationOptions);
  const [deleteCategory] = useMutation(DELETE_CATEGORY, commonMutationOptions);

  const [addTransaction] = useMutation(ADD_TRANSACTION, commonMutationOptions);
  const [updateTransaction] = useMutation(UPDATE_TRANSACTION, commonMutationOptions);
  const [deleteTransaction] = useMutation(DELETE_TRANSACTION, commonMutationOptions);
  const [saveTransactions] = useMutation(SAVE_TRANSACTIONS, commonMutationOptions);


  useEffect(() => {
    if (transactionsError) {
      setError(`Failed to load data: ${transactionsError.message}. Make sure the server is running.`);
      setIsInitialized(false);
      setCurrentPage('input');
    }
  }, [transactionsError]);
  
  const handleReset = () => {
    setStagedTransactions([]);
    setSelectedDbAccount('All Accounts');
    setError(null);
    setCurrentPage('input');
    setIsInitialized(false);
    clearAllCache();
    // Apollo cache will be cleared on next fetch if needed, or we can add client.clearStore()
  };

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);
    try {
      const parsed = await parseFile(file);
      if (parsed.length === 0) {
        throw new Error("No valid transactions found in the file.");
      }
      // We map parsed transactions to a structure that can be saved later
      const readyToStage = parsed.map(t => ({...t, category: undefined, account: undefined}));
      setStagedTransactions(readyToStage);
      setCurrentPage('import');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to parse file.');
      setCurrentPage('input');
    }
  }, []);
  
  const handleFetchFromDb = useCallback(() => {
    setError(null);
    setIsInitialized(true);
    setCurrentPage('dashboard');
  }, []);

  useEffect(() => {
    if (isInitialized && allTransactions.length > 0) {
      getAiSummary();
    }
  }, [isInitialized, allTransactions, getAiSummary]);

  // CRUD operations
  const handleSaveStagedTransactions = useCallback(async (transactionsToSave: Omit<Transaction, 'id'>[]) => {
      setError(null);
      try {
          const formattedTransactions = transactionsToSave.map(t => ({
              date: t.date,
              description: t.description,
              amount: t.amount,
              categoryId: t.category, // In import page, category/account will be the ID
              accountId: t.account,
          }));
          await saveTransactions({ variables: { transactions: formattedTransactions }});
          setCurrentPage('dashboard');
      } catch (e) {
          const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred saving transactions.';
          setError(errorMessage);
      }
  }, [saveTransactions]);

  const handleOpenModal = (transaction: Transaction | null) => {
    setTransactionToEdit(transaction);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setTransactionToEdit(null);
    setIsModalOpen(false);
  };

  const handleSaveTransaction = useCallback(async (transactionData: Omit<Transaction, 'id'>) => {
    try {
        const input = {
            date: transactionData.date,
            description: transactionData.description,
            amount: transactionData.amount,
            categoryId: transactionData.category?.id, // Storing ID
            accountId: transactionData.account?.id, // Storing ID
        };

        if (transactionToEdit) {
            await updateTransaction({ variables: { input: { ...input, id: transactionToEdit.id } } });
        } else {
            await addTransaction({ variables: { input } });
        }
        
        handleCloseModal();
    } catch(e) {
        console.error("Failed to save transaction", e);
        setError(e instanceof Error ? e.message : 'Failed to save transaction');
    }
  }, [transactionToEdit, addTransaction, updateTransaction]);

  const handleDeleteTransaction = useCallback(async (transactionId: string) => {
      if (!window.confirm("Are you sure you want to delete this transaction?")) return;
      
      try {
          await deleteTransaction({ variables: { id: transactionId } });
      } catch (e) {
          console.error("Failed to delete transaction", e);
          setError(e instanceof Error ? e.message : 'Failed to delete transaction');
      }
  }, [deleteTransaction]);

  const createSettingHandler = (
    addFunc: Function,
    updateFunc: Function,
    deleteFunc: Function,
  ) => {
    const handleAdd = async (name: string) => {
      await addFunc({ variables: { name } });
    };
    const handleUpdate = async (id: string, newName: string) => {
      await updateFunc({ variables: { id, name: newName } });
    };
    const handleDelete = async (id: string) => {
      await deleteFunc({ variables: { id } });
    };
    return { handleAdd, handleUpdate, handleDelete };
  };
  
  const categoryHandlers = createSettingHandler(addCategory, updateCategory, deleteCategory);
  const accountHandlers = createSettingHandler(addAccount, updateAccount, deleteAccount);

  const filteredTransactionsForDashboard = useMemo<Transaction[]>(() => {
    if (allTransactions.length === 0) return [];
    return selectedDbAccount === 'All Accounts'
      ? allTransactions
      : allTransactions.filter(t => t.account?.name === selectedDbAccount);
  }, [allTransactions, selectedDbAccount]);

  const financialAnalysis = useMemo<FinancialAnalysis | null>(() => {
    if (filteredTransactionsForDashboard.length === 0) return null;
    
    // Map transactions for analysis, as it expects string names
    const mappedForAnalysis = filteredTransactionsForDashboard.map(t => ({
      ...t,
      account: t.account?.name,
      category: t.category?.name
    }));
    return analyzeTransactions(mappedForAnalysis);
  }, [filteredTransactionsForDashboard]);
  
  const dbAccounts = useMemo(() => ['All Accounts', ...accounts.map(a => a.name)], [accounts]);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard 
          analysis={financialAnalysis} 
          transactions={filteredTransactionsForDashboard}
          aiSummary={aiSummaryData?.aiSummary}
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
        return <DataInput onFileSelect={handleFileSelect} onFetchFromDb={handleFetchFromDb} isLoading={isLoading && !isInitialized} />;
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
             <NavButton page="dashboard" label={t('nav.dashboard')} icon={<DatabaseIcon className="w-5 h-5"/>}/>
             <NavButton page="transactions" label={t('nav.transactions')} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>}/>
             <NavButton page="import" label={t('nav.import')} icon={<ImportIcon/>}/>
             <NavButton page="settings" label={t('nav.settings')} icon={<SettingsIcon/>}/>
        </nav>
        <div className="mt-auto flex flex-col items-center gap-4">
            <LanguageSwitcher />
            <button onClick={handleReset} className="text-gray-400 hover:text-danger text-xs flex flex-col items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                {t('common.reset')}
            </button>
        </div>
      </aside>
      
      <main className="flex-1 p-8 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto">
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                    <p className="font-bold">{t('common.error')}</p>
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
