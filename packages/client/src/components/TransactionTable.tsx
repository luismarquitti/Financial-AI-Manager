import React, { useState, useMemo, ChangeEvent } from 'react';
import type { Transaction } from '../types';
import { SortAscIcon, SortDescIcon, EditIcon, TrashIcon } from './Icons';

type SortableTransactionKeys = 'date' | 'description' | 'amount';
type SortKey = 'date' | 'description' | 'amount' | 'category' | 'account';
type SortDirection = 'asc' | 'desc';

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transactionId: string) => void;
  isSelectable?: boolean;
  selectedIds?: Set<string>;
  onSelectionChange?: (id: string, isSelected: boolean) => void;
  onSelectAll?: (isSelected: boolean) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onEdit,
  onDelete,
  isSelectable = false,
  selectedIds = new Set(),
  onSelectionChange = () => {},
  onSelectAll = () => {},
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>({ key: 'date', direction: 'desc'});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const showActions = onEdit && onDelete;

  const sortedTransactions = useMemo(() => {
    let sortableItems = [...transactions];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let valA, valB;
        if (sortConfig.key === 'category') {
          valA = a.category?.name;
          valB = b.category?.name;
        } else if (sortConfig.key === 'account') {
          valA = a.account?.name;
          valB = b.account?.name;
        } else {
          valA = a[sortConfig.key as SortableTransactionKeys];
          valB = b[sortConfig.key as SortableTransactionKeys];
        }
        
        if (valA === undefined || valA === null || valA < valB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (valB === undefined || valB === null || valA > valB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [transactions, sortConfig]);
  
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedTransactions, currentPage]);

  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };
  
  const getSortIcon = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
        return <SortAscIcon className="opacity-20"/>;
    }
    return sortConfig.direction === 'asc' ? <SortAscIcon /> : <SortDescIcon />;
  }

  const formatCurrency = (amount: number) => {
    const isNegative = amount < 0;
    const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(amount));
    return isNegative ? `-${formatted}` : formatted;
  };
  
  const headers: { key: SortKey, label: string }[] = [
    { key: 'date', label: 'Date' },
    { key: 'description', label: 'Description' },
    { key: 'category', label: 'Category' },
    { key: 'account', label: 'Account' },
    { key: 'amount', label: 'Amount' }
  ];

  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    onSelectAll(e.target.checked);
  };

  const isAllSelected = paginatedTransactions.length > 0 && paginatedTransactions.every(t => selectedIds.has(t.id));

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {isSelectable && (
                <th scope="col" className="px-6 py-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    aria-label="Select all transactions on this page"
                  />
                </th>
              )}
              {headers.map(({ key, label }) => (
                <th key={key} scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer" onClick={() => requestSort(key as SortKey)}>
                   <div className="flex items-center gap-2">
                     {label} {getSortIcon(key as SortKey)}
                   </div>
                </th>
              ))}
               {showActions && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
               )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedTransactions.length > 0 ? paginatedTransactions.map((transaction) => (
              <tr key={transaction.id} className={`hover:bg-gray-50 ${selectedIds.has(transaction.id) ? 'bg-indigo-50' : ''}`}>
                {isSelectable && (
                  <td className="px-6 py-4">
                     <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={selectedIds.has(transaction.id)}
                        onChange={(e) => onSelectionChange(transaction.id, e.target.checked)}
                      />
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.date.toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.category?.name ?? 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.account?.name ?? 'N/A'}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${transaction.amount > 0 ? 'text-secondary' : 'text-danger'}`}>
                  {formatCurrency(transaction.amount)}
                </td>
                {showActions && onEdit && onDelete && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-4">
                            <button onClick={() => onEdit(transaction)} className="text-indigo-600 hover:text-indigo-900" aria-label={`Edit transaction ${transaction.description}`}>
                            <EditIcon />
                            </button>
                            <button onClick={() => onDelete(transaction.id)} className="text-danger hover:text-red-700" aria-label={`Delete transaction ${transaction.description}`}>
                            <TrashIcon />
                            </button>
                        </div>
                    </td>
                )}
              </tr>
            )) : (
              <tr>
                <td colSpan={headers.length + (showActions ? 1 : 0) + (isSelectable ? 1 : 0)} className="text-center py-10 text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
       {totalPages > 1 && (
        <nav className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, sortedTransactions.length)}</span> of <span className="font-medium">{sortedTransactions.length}</span> results
            </p>
            <div className="flex gap-2">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </nav>
      )}
    </>
  );
};