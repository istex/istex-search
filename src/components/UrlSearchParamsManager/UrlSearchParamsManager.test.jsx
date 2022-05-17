import React from 'react';
import { describe, expect, it } from 'vitest';
import { customRender as render } from '../../test/utils';
import UrlSearchParamsManager from './UrlSearchParamsManager';

describe('Tests for the UrlSearchParamsManager component', () => {
  it('Does not render anything', () => {
    const { container } = render(<UrlSearchParamsManager />);
    expect(container.children.length).toBe(0);
  });
});
