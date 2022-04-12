/* eslint-env jest */

import React from 'react';
import { customRender as render, screen } from '../../testUtils';
import Format from './Format';
import { formats } from '../../config';

test('Renders the PDF label', () => {
  const pdfFormatName = 'PDF';
  const pdfFormatValue = formats.fulltext.pdf;
  render(<Format name={pdfFormatName} value={pdfFormatValue} />);
  const pdfLabel = screen.getByText(/pdf/i);
  expect(pdfLabel).toBeInTheDocument();
});
