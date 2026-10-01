import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfileStatus from '@/app/dashboard/player/ProfileStatus';

describe('ProfileStatus Component', () => {
  it('renders the header correctly', () => {
    render(<ProfileStatus />);
    
    expect(screen.getByText('PROFILE STATUS')).toBeInTheDocument();
  });

  it('renders the progress circle and text', () => {
    render(<ProfileStatus />);
    
    expect(screen.getByText('Almost there')).toBeInTheDocument();
    expect(screen.getByText('1 item remaining to reach 100%')).toBeInTheDocument();
  });

  it('renders the checklist items', () => {
    render(<ProfileStatus />);
    
    expect(screen.getByText('Personal details')).toBeInTheDocument();
    expect(screen.getByText('Aadhar verified')).toBeInTheDocument();
    expect(screen.getByText('Sport profile (club/coach)')).toBeInTheDocument();
  });
});
