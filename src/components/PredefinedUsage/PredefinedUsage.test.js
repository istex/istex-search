/* eslint-env jest */

import React from 'react';
import { customRender as render, screen } from '../../testUtils';
import PredefinedUsage from './PredefinedUsage';

test('Renders the PredefinedUsage title', () => {
  render(<PredefinedUsage name='myPredefinedUsage' />);
  const checkboxElement = screen.getByText(/myPredefinedUsage/i);
  expect(checkboxElement).toBeInTheDocument();
});
