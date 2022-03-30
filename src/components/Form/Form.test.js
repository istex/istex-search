/* eslint-env jest */

import React from 'react';
import { customRender as render, screen } from '../../testUtils';
import Form from './Form';

test('Renders the final URL paragraph', () => {
  render(<Form />);
  const finalUrlParagraph = screen.getByText(/final URL/i);
  expect(finalUrlParagraph).toBeInTheDocument();
});
