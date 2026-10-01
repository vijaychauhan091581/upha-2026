import React from 'react';
import { render, screen } from '@testing-library/react';
import RegistrationCards from '@/components/RegistrationCards';

describe('RegistrationCards Component', () => {
  it('renders the main description text', () => {
    render(<RegistrationCards />);
    expect(screen.getByText(/Join the official roster of Uttar Pradesh's handball community/i)).toBeInTheDocument();
  });

  it('renders the Player Registration card', () => {
    render(<RegistrationCards />);
    expect(screen.getByText('Player Registration')).toBeInTheDocument();
    expect(screen.getByText(/Open to all athletes between 12-35 years/i)).toBeInTheDocument();
    expect(screen.getByText(/Register as Player/i)).toBeInTheDocument();
  });

  it('renders the Coach Certification card', () => {
    render(<RegistrationCards />);
    expect(screen.getByText('Coach Certification')).toBeInTheDocument();
    expect(screen.getByText(/For aspiring and certified handball coaches/i)).toBeInTheDocument();
    expect(screen.getByText(/Apply as Coach/i)).toBeInTheDocument();
  });

  it('renders the Referee Accreditation card', () => {
    render(<RegistrationCards />);
    expect(screen.getByText('Referee Accreditation')).toBeInTheDocument();
    expect(screen.getByText(/For licensed match officials/i)).toBeInTheDocument();
    expect(screen.getByText(/Apply as Referee/i)).toBeInTheDocument();
  });
});
