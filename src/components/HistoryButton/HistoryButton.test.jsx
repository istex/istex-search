/* eslint-env jest */

import React from 'react';
import { customRender as render, screen } from '../../testUtils';
import HistoryButton from './HistoryButton';

test('Renders the History button', () => {
  render(<HistoryButton />);
  const buttonElement = screen.getByText(/History/i);
  expect(buttonElement).toBeInTheDocument();
});
