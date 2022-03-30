/* eslint-env jest */

import React from 'react';
import { customRender as render, screen } from '../../testUtils';
import App from './App';

test('Renders the ISTEX-DL title', () => {
  render(<App />);
  const titleElement = screen.getByText(/ISTEX-DL/i);
  expect(titleElement).toBeInTheDocument();
});
