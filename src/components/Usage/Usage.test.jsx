import React from 'react';
import { describe, expect, it } from 'vitest';
import { customRender as render, screen } from '../../test/utils';
import Usage from './Usage';
import { usages } from '../../config';

describe('Tests for the PredefinedUsage component', () => {
  it('Renders the radio button', () => {
    render(<Usage name='lodex' label={usages.lodex.label} formats={usages.lodex.value} />);
    const radioButton = screen.getByText(/Lodex/i);

    expect(radioButton).toBeInTheDocument();
  });
});
