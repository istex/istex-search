import React from 'react';
import { describe, expect, it } from 'vitest';
import { customRender as render, screen } from '../../test/utils';
import UsageSection from './UsageSection';

describe('Tests for the UsageSection component', () => {
  it('Renders the Usage title', () => {
    render(<UsageSection />);
    const titleElement = screen.getByRole('heading', { level: 2, name: 'Usage' });

    expect(titleElement).toBeInTheDocument();
  });
});
