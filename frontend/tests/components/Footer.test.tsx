import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer';

describe('Footer Component', () => {
  it('renders the UPHA logo and description', () => {
    render(<Footer />);
    
    expect(screen.getByText('UPHA')).toBeInTheDocument();
    expect(screen.getByText('EST. 1972')).toBeInTheDocument();
    expect(screen.getByText(/The Uttar Pradesh Handball Association is the recognized/i)).toBeInTheDocument();
  });

  it('renders all footer navigation links', () => {
    render(<Footer />);
    
    expect(screen.getByText('About UPHA')).toBeInTheDocument();
    expect(screen.getByText('Register as Player')).toBeInTheDocument();
  });
});
