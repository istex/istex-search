/* eslint-env jest */

import React from 'react';
import { customRender as render, screen } from '../../testUtils';
import DownloadSection from './DownloadSection';

test('Renders the Download title', () => {
  render(<DownloadSection />);
  const downloadTitle = screen.getByText(/Download/i);
  expect(downloadTitle).toBeInTheDocument();
});
