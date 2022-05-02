import React from 'react';
import { describe, expect, it } from 'vitest';
import { customRender as render, screen } from '../../test/utils';
import QuerySection from './QuerySection';

describe('Tests for the QuerySection component', () => {
  it('Renders the query title', () => {
    render(<QuerySection />);
    const queryElements = screen.getAllByText(/Query/i);
    queryElements.forEach(queryElement => expect(queryElement).toBeInTheDocument());
  });
});
