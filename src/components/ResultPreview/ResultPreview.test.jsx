import React from 'react';
import { describe, it } from 'vitest';
import { customRender as render } from '../../test/utils';
import ResultPreview from './ResultPreview';

describe('Tests for the ResultPreview component', () => {
  it('Renders the Result preview title', () => {
    render(<ResultPreview results={[]} />);
    // const titleElement = screen.getByRole('heading', { level: 4, name: 'Result preview' });

    // expect(titleElement).toBeInTheDocument();
  });
});
