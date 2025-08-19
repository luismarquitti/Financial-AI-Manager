import React, { useState, useEffect } from 'react';
import type { Transaction } from '../types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
  transaction: Transaction | null;
  categories: string[];
  accounts: string[];
}

const initialFormState: Omit<Transaction, 'id' | 'date'> & { date: string } = {
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: 0,
    category: '',
    account: '',
};

export const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSave, transaction, categories, accounts }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
        if (transaction) {
            setFormData({
                ...transaction,
                date: transaction.date.toISOString().split('T')[0],
                category: transaction.category || '',
                account: transaction.account || '',
            });
        } else {
            setFormData({
              ...initialFormState,
              category: categories[0] || '',
              account: accounts[0] || '',
            });
        }
    }
  }, [transaction, isOpen, categories, accounts]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const amount = parseFloat(formData.amount.toString());
    if (isNaN(amount)) {
        setError('Amount must be a valid number.');
        return;
    }

    if (!formData.description.trim()) {
        setError('Description is required.');
        return;
    }
    
    if (!formData.date) {
        setError('Date is required.');
        return;
    }
    
    if (!formData.category) {
        setError('Category is required.');
        return;
    }

    if (!formData.account) {
        setError('Account is required.');
        return;
    }

    onSave({
        ...formData,
        amount,
        // Add T00:00:00 to ensure the date is parsed in the local timezone, not UTC
        date: new Date(formData.date + 'T00:00:00'),
    });
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{transaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
        </div>

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <input type="text" id="description" name="description" value={formData.description} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
            <input type="number" step="0.01" id="amount" name="amount" value={formData.amount} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            <p className="text-xs text-gray-500 mt-1">Use a negative value for expenses (e.g., -50.25).</p>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select id="category" name="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="account" className="block text-sm font-medium text-gray-700">Account</label>
            <select id="account" name="account" value={formData.account} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                {accounts.map(acc => <option key={acc} value={acc}>{acc}</option>)}
            </select>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-indigo-700">
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
