
import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'danger';
}

const colorClasses = {
  primary: {
    bg: 'bg-indigo-50',
    text: 'text-primary',
    border: 'border-primary',
  },
  secondary: {
    bg: 'bg-emerald-50',
    text: 'text-secondary',
    border: 'border-secondary',
  },
  danger: {
    bg: 'bg-red-50',
    text: 'text-danger',
    border: 'border-danger',
  }
};

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, color }) => {
  const classes = colorClasses[color];
  return (
    <div className={`bg-card shadow-lg rounded-xl p-6 flex items-center space-x-4 border-l-4 ${classes.border}`}>
      <div className={`p-3 rounded-full ${classes.bg} ${classes.text}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-text-secondary">{title}</p>
        <p className="text-2xl font-bold text-text-primary">{value}</p>
      </div>
    </div>
  );
};