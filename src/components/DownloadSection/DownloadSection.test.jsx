import React from 'react';
import { describe, expect, it } from 'vitest';
import { customRender as render, screen } from '../../test/utils';
import DownloadSection from './DownloadSection';

describe('Tests for the DownloadSection component', () => {
  it('Renders the Download button', () => {
    render(<DownloadSection />);
    const downloadButton = screen.getAllByText(/Download/i).find(element => element.tagName === 'BUTTON');
    expect(downloadButton).toBeInTheDocument();
  });
});
