import React from 'react';
import { render, screen } from '@testing-library/react';
import DistrictAffiliationForm from '@/app/register/district/DistrictAffiliationForm';

describe('DistrictAffiliationForm Component', () => {
  it('renders the BEFORE YOU BEGIN alert banner', () => {
    render(<DistrictAffiliationForm />);
    expect(screen.getByText(/BEFORE YOU BEGIN/i)).toBeInTheDocument();
  });

  it('renders all four main steps', () => {
    render(<DistrictAffiliationForm />);
    expect(screen.getByText('UNIT DETAILS')).toBeInTheDocument();
    expect(screen.getByText('OFFICE BEARERS')).toBeInTheDocument();
    expect(screen.getByText('SUPPORTING DOCUMENTS')).toBeInTheDocument();
    expect(screen.getByText('PAYMENT CONFIRMATION')).toBeInTheDocument();
  });

  it('renders the office bearer cards', () => {
    render(<DistrictAffiliationForm />);
    expect(screen.getByText('ADHYAKSH')).toBeInTheDocument();
    expect(screen.getByText('SACHIV')).toBeInTheDocument();
    expect(screen.getByText('KOSHADHYAKSH')).toBeInTheDocument();
  });
});
