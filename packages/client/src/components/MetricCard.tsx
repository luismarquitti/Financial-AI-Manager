import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-3xl font-bold text-gray-800">
        {value}
        <span className="text-base font-normal text-gray-500 ml-2">{unit}</span>
      </p>
    </div>
  );
};

export default MetricCard;
