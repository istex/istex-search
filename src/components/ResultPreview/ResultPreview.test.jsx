import React from 'react';
import { describe, expect, it } from 'vitest';
import { customRender as render, screen } from '../../test/utils';
import ResultPreview from './ResultPreview';

describe('Tests for the ResultPreview component', () => {
  it('Renders the Result preview title', () => {
    render(<ResultPreview results={[]} />);
    const titleElement = screen.getByText(/Result preview/i);
    expect(titleElement).toBeInTheDocument();
  });
});
