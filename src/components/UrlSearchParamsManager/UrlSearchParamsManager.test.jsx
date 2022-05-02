import React from 'react';
import { describe, expect, it } from 'vitest';
import { customRender as render, screen } from '../../test/utils';
import UrlSearchParamsManager from './UrlSearchParamsManager';

describe('Tests for the UrlSearchParamsManager component', () => {
  it('Does not render anything', () => {
    render(<UrlSearchParamsManager />);
    const titleElement = screen.queryByText(/UrlSearchParamsManager/i);
    expect(titleElement).not.toBeInTheDocument();
  });
});
