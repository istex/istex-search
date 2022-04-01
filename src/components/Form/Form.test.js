/* eslint-env jest */

import React from 'react';
import { customRender as render, screen } from '../../testUtils';
import Form from './Form';

test('Renders the Usage title', () => {
  render(<Form />);
  const usageTitle = screen.getByText(/Usage/i);
  expect(usageTitle).toBeInTheDocument();
});
