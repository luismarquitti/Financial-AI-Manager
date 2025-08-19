import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, Sector } from 'recharts';
import type { FinancialAnalysis, AiSummary, MonthlySummary, CategorySummary } from '../types';
import { SummaryCard } from './SummaryCard';
import { TransactionTable } from './TransactionTable';
import { AiIcon, CheckCircleIcon, LightBulbIcon, TrendingDownIcon, TrendingUpIcon } from './Icons';

interface DashboardProps {
  analysis: FinancialAnalysis | null;
  aiSummary: AiSummary | null;
  isLoading: boolean;
  isAiLoading: boolean;
  accounts: string[];
  selectedAccount: string;
  onAccountChange: (account: string) => void;
}

const COLORS = ['#4f46e5', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="font-bold text-lg">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="font-semibold">{`$${value.toFixed(2)}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`( ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const LoadingSkeleton: React.FC = () => (
    <div className="animate-pulse">
        <div className="h-16 bg-gray-200 rounded-lg mb-6 w-1/2"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="h-28 bg-gray-200 rounded-lg"></div>
            <div className="h-28 bg-gray-200 rounded-lg"></div>
            <div className="h-28 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="bg-gray-200 rounded-lg h-96 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-200 rounded-lg h-80"></div>
            <div className="bg-gray-200 rounded-lg h-80"></div>
        </div>
    </div>
);

// Workaround for recharts typing issue. `activeIndex` is a valid prop for `Pie`
// but is not present in the type definitions.
const PieWithActiveIndex = Pie as any;

export const Dashboard: React.FC<DashboardProps> = ({ analysis, aiSummary, isLoading, isAiLoading, accounts, selectedAccount, onAccountChange }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  if (isLoading || !analysis) {
    return <LoadingSkeleton />;
  }

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  return (
    <div className="space-y-8">
      {/* Header with Account Selector */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Financial Overview
          </h2>
          <p className="text-text-secondary mt-1">
            Analysis for: <span className="font-semibold text-primary">{selectedAccount}</span>
          </p>
        </div>
        {accounts.length > 1 && (
          <div>
            <label htmlFor="account-select" className="sr-only">
              Filter by Account
            </label>
            <select
              id="account-select"
              value={selectedAccount}
              onChange={(e) => onAccountChange(e.target.value)}
              className="w-full sm:w-auto bg-white border border-gray-300 text-text-primary font-medium rounded-lg focus:ring-primary focus:border-primary block p-2.5 shadow-sm"
            >
              {accounts.map(account => (
                <option key={account} value={account}>
                  {account}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Total Income" value={formatCurrency(analysis.totalIncome)} icon={<TrendingUpIcon />} color="secondary" />
        <SummaryCard title="Total Expenses" value={formatCurrency(Math.abs(analysis.totalExpenses))} icon={<TrendingDownIcon />} color="danger" />
        <SummaryCard title="Net Savings" value={formatCurrency(analysis.netSavings)} icon={<CheckCircleIcon />} color="primary" />
      </div>

      {/* AI Summary Section */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-indigo-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 p-2 rounded-full"><AiIcon /></div>
              <h3 className="text-2xl font-bold text-gray-800">AI Financial Analyst</h3>
            </div>
             {isAiLoading ? (
                <div className="flex items-center justify-center p-8 space-x-3">
                    <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p className="text-text-secondary font-medium">Gemini is analyzing your data...</p>
                </div>
            ) : aiSummary ? (
                <div className="space-y-4 text-gray-600">
                    <p className="italic">"{aiSummary.overallSummary}"</p>
                    <div className="bg-green-50 border-l-4 border-secondary p-4 rounded-r-lg">
                        <h4 className="font-semibold text-green-800">Income Analysis</h4>
                        <p>{aiSummary.incomeAnalysis}</p>
                    </div>
                    <div className="bg-red-50 border-l-4 border-danger p-4 rounded-r-lg">
                        <h4 className="font-semibold text-red-800">Expense Analysis</h4>
                        <p>{aiSummary.expenseAnalysis}</p>
                    </div>
                     <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                        <h4 className="font-semibold text-blue-800 flex items-center gap-2"><LightBulbIcon/> Actionable Insights</h4>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            {aiSummary.actionableInsights.map((insight, i) => <li key={i}>{insight}</li>)}
                        </ul>
                    </div>
                </div>
            ) : (
                <p className="text-text-secondary">Could not generate AI summary.</p>
            )}
        </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-card shadow-lg rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Monthly Income vs. Expenses</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={analysis.monthlySummaries} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="income" fill="#10b981" name="Income" radius={[4, 4, 0, 0]}/>
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 bg-card shadow-lg rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Expense Categories</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <PieWithActiveIndex
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={analysis.categorySummaries}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={110}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
                paddingAngle={5}
              >
                  {analysis.categorySummaries.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
              </PieWithActiveIndex>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Transaction Table */}
      <div className="bg-card shadow-lg rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">All Transactions</h3>
        <TransactionTable transactions={analysis.transactions} />
      </div>
    </div>
  );
};
