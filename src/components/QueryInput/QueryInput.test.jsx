import React from 'react';
import { describe, expect, it } from 'vitest';
import { customRender as render, screen } from '../../test/utils';
import QueryInput from './QueryInput';

describe('Tests for the QueryInput component', () => {
  it('Renders the query string text input', () => {
    render(<QueryInput />);
    const titleElement = screen.getByRole('textbox');

    expect(titleElement).toBeInTheDocument();
  });
});
