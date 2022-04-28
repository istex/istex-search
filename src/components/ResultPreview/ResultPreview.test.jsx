/* eslint-env jest */

import React from 'react';
import { customRender as render, screen } from '../../testUtils';
import ResultPreview from './ResultPreview';

test('Renders the Result preview title', () => {
  render(<ResultPreview results={[]} />);
  const titleElement = screen.getByText(/Result preview/i);
  expect(titleElement).toBeInTheDocument();
});
