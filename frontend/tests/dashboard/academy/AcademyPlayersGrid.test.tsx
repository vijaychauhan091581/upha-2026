import React from 'react';
import { render, screen } from '@testing-library/react';
import AcademyPlayersGrid from '@/app/dashboard/academy/AcademyPlayersGrid';

describe('AcademyPlayersGrid Component', () => {
  it('renders the header correctly', () => {
    render(<AcademyPlayersGrid />);
    
    expect(screen.getByText('OUR PLAYERS')).toBeInTheDocument();
    expect(screen.getByText(/VIEW ALL/i)).toBeInTheDocument();
  });

  it('renders player cards from the sample data', () => {
    render(<AcademyPlayersGrid />);
    
    expect(screen.getByText('Arjun Verma')).toBeInTheDocument();
    expect(screen.getByText('Priya Gupta')).toBeInTheDocument();
    expect(screen.getByText('Aakash Tiwari')).toBeInTheDocument();
    expect(screen.getByText('PLR-00417 · Senior M')).toBeInTheDocument();
  });

  it('renders the register new player action button', () => {
    render(<AcademyPlayersGrid />);
    
    expect(screen.getByText(/REGISTER A NEW PLAYER/i)).toBeInTheDocument();
  });
});
