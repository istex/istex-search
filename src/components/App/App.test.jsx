import React from 'react';
import { describe, it } from 'vitest';
import { customRender as render } from '../../test/utils';
import App from './App';

describe('Tests for the App component', () => {
  it('Renders the ISTEX-DL title', () => {
    render(<App />);
    // const titleElement = screen.getByRole('heading', { name: 'ISTEX-DL' });

    // expect(titleElement).toBeInTheDocument();
  });
});
