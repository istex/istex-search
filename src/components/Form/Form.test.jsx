import React from 'react';
import { describe, expect, it } from 'vitest';
import { customRender as render, screen } from '../../test/utils';
import Form from './Form';

describe('Tests for the Form component', () => {
  it('Renders the Usage title', () => {
    render(<Form />);
    const usageTitle = screen.getByRole('heading', { name: 'Usage' });

    expect(usageTitle).toBeInTheDocument();
  });
});
