import React from 'react';
import { describe, expect, it } from 'vitest';
import { customRender as render, screen } from '../../test/utils';
import Navbar from './Navbar';

describe('Tests for the App component', () => {
  it('Renders the navbar title', () => {
    render(<Navbar />);
    const titleElement = screen.getByText(/Navbar/i);
    expect(titleElement).toBeInTheDocument();
  });
});
