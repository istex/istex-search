/* eslint-env jest */

import React from 'react';
import { customRender as render, screen } from '../../testUtils';
import UsageSection from './UsageSection';

test('Renders the Usage title', () => {
  render(<UsageSection />);
  const titleElement = screen.getByText(/Usage/i);
  expect(titleElement).toBeInTheDocument();
});
