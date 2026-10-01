import React from 'react';
import { render, screen } from '@testing-library/react';
import ApplicationCategoryTabs from '@/app/dashboard/admin/ApplicationCategoryTabs';

describe('ApplicationCategoryTabs Component', () => {
  it('renders all five category tabs with correct counts', () => {
    render(<ApplicationCategoryTabs />);
    
    expect(screen.getByText('PLAYERS')).toBeInTheDocument();
    expect(screen.getByText('28')).toBeInTheDocument();
    expect(screen.getByText('COACHES')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('REFEREES')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });
});
