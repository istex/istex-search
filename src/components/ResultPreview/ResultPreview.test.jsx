import React from 'react';
import { describe, expect, it } from 'vitest';
import { customRender as render, screen } from '../../test/utils';
import ResultPreview from './ResultPreview';

describe('Tests for the ResultPreview component', () => {
  it('Renders the Result preview title', () => {
    render(<ResultPreview results={[]} />);
    const titleElement = screen.getByRole('heading', { level: 4, name: 'Result preview' });

    expect(titleElement).toBeInTheDocument();
  });
});
