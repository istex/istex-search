/* eslint-env jest */

import React from 'react';
import { customRender as render, screen } from '../../testUtils';
import Navbar from './Navbar';

test('Renders the navbar title', () => {
  render(<Navbar />);
  const titleElement = screen.getByText(/Navbar/i);
  expect(titleElement).toBeInTheDocument();
});
