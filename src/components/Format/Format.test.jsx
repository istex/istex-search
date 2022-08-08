import React from 'react';
import { describe, expect, it } from 'vitest';
import { customRender as render, screen } from '../../test/utils';
import Format from './Format';
import { formats } from '../../config';

describe('Tests for the Format component', () => {
  it('Renders the PDF checkbox', () => {
    const pdfFormat = formats.fulltext.formats.pdf;
    render(<Format name={pdfFormat.label} value={pdfFormat.value} />);
    const pdfCheckbox = screen.getByRole('checkbox');

    expect(pdfCheckbox).toBeInTheDocument();
    expect(pdfCheckbox.name).toBe(pdfFormat.label);
  });
});
