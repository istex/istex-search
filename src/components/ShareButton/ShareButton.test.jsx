import React from 'react';
import { describe, expect, it } from 'vitest';
import { customRender as render, screen } from '../../test/utils';
import ShareButton from './ShareButton';

describe('Tests for the ShareButton component', () => {
  it('Renders the share button', () => {
    render(<ShareButton />);
    const buttonElement = screen.getByRole('button');

    expect(buttonElement).toBeInTheDocument();
  });
});
