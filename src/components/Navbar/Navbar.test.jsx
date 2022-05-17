import React from 'react';
import { describe, expect, it } from 'vitest';
import { customRender as render, screen } from '../../test/utils';
import Navbar from './Navbar';

describe('Tests for the App component', () => {
  it('Renders the navbar title', () => {
    render(<Navbar />);
    const titleElement = screen.getByRole('heading', { level: 2, name: 'Navbar' });

    expect(titleElement).toBeInTheDocument();
  });
});
