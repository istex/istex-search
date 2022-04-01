/* eslint-env jest */

import React from 'react';
import { customRender as render, screen } from '../../testUtils';
import DownloadSection from './DownloadSection';

test('Renders the Download button', () => {
  render(<DownloadSection />);
  const downloadButton = screen.getAllByText(/Download/i).find(element => element.tagName === 'BUTTON');
  expect(downloadButton).toBeInTheDocument();
});
