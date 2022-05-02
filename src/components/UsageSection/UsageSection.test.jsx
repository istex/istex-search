import React from 'react';
import { describe, expect, it } from 'vitest';
import { customRender as render, screen } from '../../test/utils';
import UsageSection from './UsageSection';

describe('Tests for the UsageSection component', () => {
  it('Renders the Usage title', () => {
    render(<UsageSection />);
    const titleElement = screen.getByText(/Usage/i);
    expect(titleElement).toBeInTheDocument();
  });
});
