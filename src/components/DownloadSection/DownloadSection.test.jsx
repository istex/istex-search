import React from 'react';
import { describe, expect, it } from 'vitest';
import { customRender as render, screen } from '../../test/utils';
import DownloadSection from './DownloadSection';

describe('Tests for the DownloadSection component', () => {
  it('Renders the archive type radio buttons\' label', () => {
    render(<DownloadSection />);

    expect(screen.getByText(/Niveau de compression/i)).toBeDefined();
  });
});
