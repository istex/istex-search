import React from 'react';
import { describe, expect, it } from 'vitest';
import { customRender as render, screen } from '../../test/utils';
import PredefinedUsage from './PredefinedUsage';

describe('Tests for the PredefinedUsage component', () => {
  it('Renders the PredefinedUsage title', () => {
    render(<PredefinedUsage name='myPredefinedUsage' />);
    const checkboxElement = screen.getByText(/myPredefinedUsage/i);
    expect(checkboxElement).toBeInTheDocument();
  });
});
