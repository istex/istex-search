/* eslint-env jest */

import React from 'react';
import { customRender as render, screen } from '../../testUtils';
import ShareButton from './ShareButton';

test('Renders the share button', () => {
  render(<ShareButton />);
  const buttonElement = screen.getByText(/Share/i);
  expect(buttonElement).toBeInTheDocument();
});
