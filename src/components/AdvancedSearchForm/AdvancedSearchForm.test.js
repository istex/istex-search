import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AdvancedSearchForm from './AdvancedSearchForm';

describe('<AdvancedSearchForm />', () => {
  test('it should mount', () => {
    render(<AdvancedSearchForm />);
    
    const advancedSearchForm = screen.getByTestId('AdvancedSearchForm');

    expect(advancedSearchForm).toBeInTheDocument();
  });
});