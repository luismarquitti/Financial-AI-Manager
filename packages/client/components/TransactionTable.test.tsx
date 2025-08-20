import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TransactionTable } from './TransactionTable';
import type { Transaction } from '../types';

// Mock Icon components
jest.mock('./Icons', () => ({
  SortAscIcon: () => <span data-testid="sort-asc-icon">▲</span>,
  SortDescIcon: () => <span data-testid="sort-desc-icon">▼</span>,
  EditIcon: () => 'Edit',
  TrashIcon: () => 'Trash',
}));

const mockTransactions: Transaction[] = [
  { id: '1', date: new Date('2023-01-25'), description: 'Project Payment', amount: 2000, category: 'Freelance', account: 'Business' },
  { id: '2', date: new Date('2023-01-20'), description: 'Office Supplies', amount: -100, category: 'Business', account: 'Business' },
  { id: '3', date: new Date('2023-01-30'), description: 'Software Subscription', amount: -50, category: 'Business', account: 'Business' },
];

describe('TransactionTable', () => {
  it('should render transactions correctly', () => {
    render(<TransactionTable transactions={mockTransactions} />);
    expect(screen.getByText('Project Payment')).toBeInTheDocument();
    expect(screen.getByText('Office Supplies')).toBeInTheDocument();
    expect(screen.getByText('Software Subscription')).toBeInTheDocument();
  });

  it('should sort transactions when a header is clicked', () => {
    render(<TransactionTable transactions={mockTransactions} />);

    // Initial render should be sorted by date descending (default)
    let rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Software Subscription');
    expect(rows[2]).toHaveTextContent('Project Payment');
    expect(rows[3]).toHaveTextContent('Office Supplies');

    // Click on "Description" to sort alphabetically
    fireEvent.click(screen.getByText('Description'));
    rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Office Supplies');
    expect(rows[2]).toHaveTextContent('Project Payment');
    expect(rows[3]).toHaveTextContent('Software Subscription');

    // Click again to reverse order
    fireEvent.click(screen.getByText('Description'));
    rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Software Subscription');
    expect(rows[2]).toHaveTextContent('Project Payment');
    expect(rows[3]).toHaveTextContent('Office Supplies');
  });

  it('should paginate transactions', () => {
    const manyTransactions = Array.from({ length: 15 }, (_, i) => ({
      id: `${i}`,
      date: new Date(`2023-01-${15 + i}`),
      description: `Transaction ${i + 1}`,
      amount: 10 * (i + 1),
      category: 'Test',
      account: 'Test'
    }));
    render(<TransactionTable transactions={manyTransactions} />);

    expect(screen.getByText('Transaction 1')).toBeInTheDocument();
    expect(screen.queryByText('Transaction 11')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Next'));

    expect(screen.queryByText('Transaction 1')).not.toBeInTheDocument();
    expect(screen.getByText('Transaction 11')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Previous'));

    expect(screen.getByText('Transaction 1')).toBeInTheDocument();
  });

  it('should handle row selection', () => {
    const onSelectionChange = jest.fn();
    const onSelectAll = jest.fn();
    render(
      <TransactionTable
        transactions={mockTransactions}
        isSelectable={true}
        onSelectionChange={onSelectionChange}
        onSelectAll={onSelectAll}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    // First checkbox is the "select all" header
    fireEvent.click(checkboxes[1]);
    expect(onSelectionChange).toHaveBeenCalledWith('3', true); // Sorted by date desc by default

    fireEvent.click(checkboxes[0]);
    expect(onSelectAll).toHaveBeenCalledWith(true);
  });

  it('should show and handle actions', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    render(<TransactionTable transactions={mockTransactions} onEdit={onEdit} onDelete={onDelete} />);

    const editButtons = screen.getAllByText('Edit');
    const deleteButtons = screen.getAllByText('Trash');

    fireEvent.click(editButtons[0]);
    expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({ id: '3' })); // Sorted by date desc by default

    fireEvent.click(deleteButtons[0]);
    expect(onDelete).toHaveBeenCalledWith('3');
  });
});
