/* eslint-env jest */

import React from 'react';
import { customRender as render, screen } from '../../testUtils';
import ResetButton from './ResetButton';

test('Renders the reset button', () => {
  render(<ResetButton />);
  const buttonElement = screen.getByText(/Reset Form/i);
  expect(buttonElement).toBeInTheDocument();
});
