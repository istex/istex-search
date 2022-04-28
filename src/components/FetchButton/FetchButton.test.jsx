/* eslint-env jest */

import React from 'react';
import { customRender as render, screen } from '../../testUtils';
import FetchButton from './FetchButton';

test('Renders the fetch button', () => {
  render(<FetchButton />);
  const buttonElement = screen.getByText(/Fetch/i);
  expect(buttonElement).toBeInTheDocument();
});
