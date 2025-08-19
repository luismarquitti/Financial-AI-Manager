
import React, { useState, useMemo, useCallback } from 'react';
import type { Transaction, Category, Account } from '../types';
import { TransactionTable } from '../components/TransactionTable';
import { TransactionModal } from '../components/TransactionModal';
import { SaveIcon } from '../components/Icons';

interface ImportPageProps {
  stagedTransactions: Transaction[];
  setStagedTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  onSave: (transactionsToSave: Omit<Transaction, 'id'>[]) => void;
  onCancel: () => void;
  isLoading: boolean;
  categories: Category[];
  accounts: Account[];
}

export const ImportPage: React.FC<ImportPageProps> = ({ stagedTransactions, setStagedTransactions, onSave, onCancel, isLoading, categories, accounts }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(stagedTransactions.map(t => t.id)));
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);

  const handleSelectionChange = useCallback((id: string, isSelected: boolean) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback((isSelected: boolean) => {
    if (isSelected) {
      setSelectedIds(new Set(stagedTransactions.map(t => t.id)));
    } else {
      setSelectedIds(new Set());
    }
  }, [stagedTransactions]);

  const handleAddTransaction = () => {
    setTransactionToEdit(null);
    setIsModalOpen(true);
  };
  
  const handleEditTransaction = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setIsModalOpen(true);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    setStagedTransactions(prev => prev.filter(t => t.id !== transactionId));
    setSelectedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(transactionId);
        return newSet;
    });
  };

  const handleSaveTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    if (transactionToEdit) {
      // Editing existing staged transaction
      const updatedTx: Transaction = { ...transactionToEdit, ...transactionData };
      setStagedTransactions(prev => prev.map(t => t.id === updatedTx.id ? updatedTx : t));
    } else {
      // Adding new transaction to stage
      const newTx: Transaction = { ...transactionData, id: `new-${Date.now()}` };
      setStagedTransactions(prev => [newTx, ...prev]);
    }
    setIsModalOpen(false);
    setTransactionToEdit(null);
  };
  
  const handleConfirmSave = () => {
      const transactionsToSave = stagedTransactions
        .filter(t => selectedIds.has(t.id))
        .map(t => ({
            date: t.date,
            description: t.description,
            amount: t.amount,
            category: t.category?.id, // Pass ID
            account: t.account?.id, // Pass ID
        }));
      onSave(transactionsToSave as any);
  };

  const selectedCount = selectedIds.size;

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Review & Import Transactions</h2>
            <p className="text-text-secondary mt-1">Select, edit, and confirm transactions before saving to the database.</p>
          </div>
          <div className="flex items-center gap-4">
             <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300"
                disabled={isLoading}
              >
                Cancel
            </button>
            <button
              onClick={handleConfirmSave}
              disabled={isLoading || selectedCount === 0}
              className="px-5 py-2.5 bg-secondary text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center gap-2 disabled:bg-emerald-300 disabled:cursor-not-allowed"
            >
              {isLoading 
                ? <><svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Saving...</>
                : <><SaveIcon /> Save Selected ({selectedCount}) to Database</>
              }
            </button>
          </div>
      </div>

      <div className="bg-card shadow-lg rounded-xl p-6">
        <div className="mb-4 flex justify-between items-center">
            <h3 className="text-xl font-bold">Staged Transactions ({stagedTransactions.length})</h3>
            <button
                onClick={handleAddTransaction}
                className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm"
            >
                Add Transaction
            </button>
        </div>
        <TransactionTable 
            transactions={stagedTransactions}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
            isSelectable={true}
            selectedIds={selectedIds}
            onSelectionChange={handleSelectionChange}
            onSelectAll={handleSelectAll}
        />
      </div>

       {isModalOpen && (
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTransaction}
          transaction={transactionToEdit}
          categories={categories}
          accounts={accounts}
        />
      )}
    </div>
  );
};