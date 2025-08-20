import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SummaryCard } from './SummaryCard';
import { TrendingUpIcon } from './Icons';

describe('SummaryCard', () => {
  it('renders the title, value, and icon correctly', () => {
    const title = 'Total Income';
    const value = '$10,000.00';
    const icon = <TrendingUpIcon />;

    render(<SummaryCard title={title} value={value} icon={icon} color="secondary" />);

    // Check if the title is in the document
    expect(screen.getByText(title)).toBeInTheDocument();

    // Check if the value is in the document
    expect(screen.getByText(value)).toBeInTheDocument();
    
    // Check if the parent of the icon has the correct color class
    const iconContainer = screen.getByText(title).parentElement?.previousElementSibling;
    expect(iconContainer).toHaveClass('bg-emerald-50');
  });
});