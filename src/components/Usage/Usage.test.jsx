import React from 'react';
import { describe, expect, it } from 'vitest';
import { customRender as render, screen } from '../../test/utils';
import Usage from './Usage';
import { usages } from '../../config';

describe('Tests for the Usage component', () => {
  it('Renders the radio button', () => {
    render(<Usage usageInfo={{ name: 'lodex', ...usages.lodex }} />);
    const radioButton = screen.getByText(/Lodex/i);

    expect(radioButton).toBeInTheDocument();
  });
});
