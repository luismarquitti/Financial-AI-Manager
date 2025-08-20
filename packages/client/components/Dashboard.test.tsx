import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Dashboard } from './Dashboard';
import type { FinancialAnalysis, AiSummary } from '../types';

// Mock child components to isolate the Dashboard component
jest.mock('./SummaryCard', () => ({
  SummaryCard: ({ title, value }: { title: string, value: string }) => (
    <div data-testid="summary-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  ),
}));

jest.mock('./TransactionTable', () => ({
  TransactionTable: () => <div data-testid="transaction-table">Transaction Table</div>,
}));

jest.mock('./Icons', () => ({
  AiIcon: () => <svg />,
  CheckCircleIcon: () => <svg />,
  LightBulbIcon: () => <svg />,
  TrendingDownIcon: () => <svg />,
  TrendingUpIcon: () => <svg />,
}));

// Mock recharts library
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="recharts-container">{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  Legend: () => <div />,
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div />,
  Cell: () => <div />,
  Sector: () => <div />,
}));

const mockAnalysis: FinancialAnalysis = {
  totalIncome: 10000,
  totalExpenses: -5000,
  netSavings: 5000,
  monthlySummaries: [{ month: 'Jan', income: 10000, expenses: 5000 }],
  categorySummaries: [{ name: 'Food', value: 2000 }],
  transactions: [], // Simplified for this test
};

const mockAiSummary: AiSummary = {
  overallSummary: 'Good financial health.',
  incomeAnalysis: 'Consistent income.',
  expenseAnalysis: 'Reasonable spending.',
  actionableInsights: ['Save more.'],
};

describe('Dashboard', () => {
  it('should render the loading skeleton when isLoading is true', () => {
    render(
      <Dashboard
        analysis={null}
        aiSummary={null}
        isLoading={true}
        isAiLoading={false}
        accounts={[]}
        selectedAccount=""
        onAccountChange={() => {}}
      />
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render the main dashboard when data is provided', () => {
    render(
      <Dashboard
        analysis={mockAnalysis}
        aiSummary={mockAiSummary}
        isLoading={false}
        isAiLoading={false}
        accounts={['Checking', 'Savings']}
        selectedAccount="Checking"
        onAccountChange={() => {}}
      />
    );

    expect(screen.getByText('Financial Overview')).toBeInTheDocument();
    expect(screen.getByText('Analysis for:')).toBeInTheDocument();
    expect(screen.getByText('Checking')).toBeInTheDocument();
    expect(screen.getAllByTestId('summary-card')).toHaveLength(3);
    expect(screen.getByTestId('transaction-table')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('should show the AI loading state when isAiLoading is true', () => {
    render(
      <Dashboard
        analysis={mockAnalysis}
        aiSummary={null}
        isLoading={false}
        isAiLoading={true}
        accounts={['Checking']}
        selectedAccount="Checking"
        onAccountChange={() => {}}
      />
    );
    expect(screen.getByText(/Gemini is analyzing your data.../i)).toBeInTheDocument();
  });

  it('should render the AI summary when provided', () => {
    render(
      <Dashboard
        analysis={mockAnalysis}
        aiSummary={mockAiSummary}
        isLoading={false}
        isAiLoading={false}
        accounts={['Checking']}
        selectedAccount="Checking"
        onAccountChange={() => {}}
      />
    );

    expect(screen.getByText('AI Financial Analyst')).toBeInTheDocument();
    expect(screen.getByText(/Good financial health./i)).toBeInTheDocument();
    expect(screen.getByText(/Consistent income./i)).toBeInTheDocument();
    expect(screen.getByText(/Reasonable spending./i)).toBeInTheDocument();
    expect(screen.getByText(/Save more./i)).toBeInTheDocument();
  });

  it('should call onAccountChange when a new account is selected', () => {
    const handleAccountChange = jest.fn();
    render(
      <Dashboard
        analysis={mockAnalysis}
        aiSummary={mockAiSummary}
        isLoading={false}
        isAiLoading={false}
        accounts={['Checking', 'Savings']}
        selectedAccount="Checking"
        onAccountChange={handleAccountChange}
      />
    );

    const select = screen.getByLabelText('Filter by Account');
    fireEvent.change(select, { target: { value: 'Savings' } });

    expect(handleAccountChange).toHaveBeenCalledTimes(1);
    expect(handleAccountChange).toHaveBeenCalledWith('Savings');
  });
});
