import React from 'react';
import { describe, expect, it } from 'vitest';
import { customRender as render, screen } from '../../test/utils';
import App from './App';

describe('Tests for the App component', () => {
  it('Renders the ISTEX-DL title', () => {
    render(<App />);
    const titleElement = screen.getByText(/ISTEX-DL/i);
    expect(titleElement).toBeInTheDocument();
  });
});
