import React from 'react';
import { describe, expect, it } from 'vitest';
import { customRender as render, screen } from '../../test/utils';
import DownloadButton from './DownloadButton';

describe('Tests for the DownloadButton component', () => {
  it('Renders the Download button', () => {
    render(<DownloadButton />);
    const downloadButton = screen.getByRole('button');

    expect(downloadButton).toBeInTheDocument();
  });
});
