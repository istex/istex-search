import React from 'react';
import { describe, expect, it } from 'vitest';
import { customRender as render, screen } from '../../test/utils';
import QuerySection from './QuerySection';
import { queryModes } from '../../config';

describe('Tests for the QuerySection component', () => {
  it('Renders the query title', () => {
    render(<QuerySection />);
    const queryTitle = screen.getByRole('heading', { level: 2, name: 'Query' });

    expect(queryTitle).toBeInTheDocument();
  });

  it('Renders a radio button for each query mode', () => {
    render(<QuerySection />);

    queryModes.modes.forEach(queryMode => {
      const queryModeRadioButton = screen.getByText(queryMode);
      expect(queryModeRadioButton).toBeInTheDocument();
      expect(queryModeRadioButton.textContent).toBe(queryMode);
    });
  });
});
