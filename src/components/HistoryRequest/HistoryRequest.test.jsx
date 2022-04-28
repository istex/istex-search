/* eslint-env jest */

import React from 'react';
import { customRender as render, screen } from '../../testUtils';
import HistoryRequest from './HistoryRequest';

test('Renders the request date', () => {
  render(<HistoryRequest requestInfo={{ index: 0, date: 123 }} />);
  const dateElement = screen.getByText(/123/i);
  expect(dateElement).toBeInTheDocument();
});
