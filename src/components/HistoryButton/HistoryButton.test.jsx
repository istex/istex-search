import React from 'react';
import { describe, expect, it } from 'vitest';
import { customRender as render, screen } from '../../test/utils';
import HistoryButton from './HistoryButton';

describe('Tests for the HistoryButton component', () => {
  it('Renders the History button', () => {
    render(<HistoryButton />);
    const buttonElement = screen.getByRole('button', { name: 'History' });

    expect(buttonElement).toBeInTheDocument();
  });
});
