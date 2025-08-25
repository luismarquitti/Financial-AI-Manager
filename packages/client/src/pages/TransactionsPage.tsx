
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Transaction, Category, Account } from '../types';
import { TransactionTable } from '../components/TransactionTable';

interface TransactionsPageProps {
  transactions: Transaction[];
  onAdd: () => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: string) => void;
  categories: Category[];
  accounts: Account[];
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({ transactions, onAdd, onEdit, onDelete, categories }) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All'); // All, Income, Expense
    const [dateRange, setDateRange] = useState<{ start: string, end: string }>({ start: '', end: '' });

    const uniqueCategories = useMemo(() => [t('common.all'), ...categories.map(c => c.name)], [categories, t]);

    const filteredTransactions = useMemo(() => {
        return transactions.filter(transaction => {
            const transactionDate = transaction.date;
            
            const startDate = dateRange.start ? new Date(dateRange.start + 'T00:00:00') : null;
            const endDate = dateRange.end ? new Date(dateRange.end + 'T00:00:00') : null;
            
            if (startDate && transactionDate < startDate) return false;
            if (endDate) {
                const endOfDay = new Date(endDate);
                endOfDay.setHours(23, 59, 59, 999);
                if(transactionDate > endOfDay) return false;
            }

            if (typeFilter === 'Income' && transaction.amount < 0) return false;
            if (typeFilter === 'Expense' && transaction.amount >= 0) return false;

            if (categoryFilter !== t('common.all') && transaction.category?.name !== categoryFilter) return false;

            if (searchTerm && !transaction.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;

            return true;
        });
    }, [transactions, searchTerm, categoryFilter, typeFilter, dateRange, t]);

    const filteredSummary = useMemo(() => {
        return filteredTransactions.reduce((acc, t) => {
            if (t.amount > 0) {
                acc.income += t.amount;
            } else {
                acc.expenses += t.amount;
            }
            return acc;
        }, { income: 0, expenses: 0 });
    }, [filteredTransactions]);

    const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

    const resetFilters = () => {
        setSearchTerm('');
        setCategoryFilter('All');
        setTypeFilter('All');
        setDateRange({ start: '', end: '' });
    };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            {t('transactionsPage.title')}
          </h2>
          <p className="text-text-secondary mt-1">
            {t('transactionsPage.subtitle')}
          </p>
        </div>
        <button
            onClick={onAdd}
            className="px-5 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
            {t('transactionsPage.addTransaction')}
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white shadow-md rounded-xl p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">{t('transactionsPage.searchLabel')}</label>
                <input type="text" id="search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder={t('transactionsPage.searchPlaceholder')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>

            {/* Type Filter */}
            <div>
                <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700">{t('transactionsPage.typeLabel')}</label>
                <select id="type-filter" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="All">{t('common.all')}</option>
                    <option value="Income">{t('common.income')}</option>
                    <option value="Expense">{t('common.expense')}</option>
                </select>
            </div>
            
            {/* Category Filter */}
            <div>
                <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700">{t('common.category')}</label>
                <select id="category-filter" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>

             <div className="self-end">
                <button onClick={resetFilters} className="w-full px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">{t('transactionsPage.resetFilters')}</button>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Date Range */}
            <div>
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">{t('transactionsPage.startDate')}</label>
                <input type="date" id="start-date" value={dateRange.start} onChange={e => setDateRange(prev => ({...prev, start: e.target.value}))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div>
                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">{t('transactionsPage.endDate')}</label>
                <input type="date" id="end-date" value={dateRange.end} onChange={e => setDateRange(prev => ({...prev, end: e.target.value}))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
        </div>
      </div>
      
      {/* Filtered Summary */}
      <div className="bg-white shadow-md rounded-xl p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-3">{t('transactionsPage.filteredSummary')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50 p-4 rounded-lg border-l-4 border-secondary">
                <p className="text-sm font-medium text-text-secondary">{t('dashboard.totalIncome')}</p>
                <p className="text-2xl font-bold text-secondary">{formatCurrency(filteredSummary.income)}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-danger">
                <p className="text-sm font-medium text-text-secondary">{t('dashboard.totalExpenses')}</p>
                <p className="text-2xl font-bold text-danger">{formatCurrency(Math.abs(filteredSummary.expenses))}</p>
            </div>
        </div>
      </div>
      
      {/* Transaction Table */}
      <div className="bg-card shadow-lg rounded-xl p-6">
        <TransactionTable transactions={filteredTransactions} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
};
