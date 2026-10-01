import React from 'react';
import { render, screen } from '@testing-library/react';
import RecentDecisionsLog from '@/app/dashboard/admin/RecentDecisionsLog';

describe('RecentDecisionsLog Component', () => {
  it('renders the header correctly', () => {
    render(<RecentDecisionsLog />);
    
    expect(screen.getByText('RECENT DECISIONS')).toBeInTheDocument();
    expect(screen.getByText(/FULL AUDIT LOG/i)).toBeInTheDocument();
  });

  it('renders recent decisions in the feed', () => {
    render(<RecentDecisionsLog />);
    
    expect(screen.getByText(/Rohit Kashyap/i)).toBeInTheDocument();
    expect(screen.getByText(/Pinky Devi/i)).toBeInTheDocument();
    expect(screen.getByText(/Devraj Mishra/i)).toBeInTheDocument();
  });
});
