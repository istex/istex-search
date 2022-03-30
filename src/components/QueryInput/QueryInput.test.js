/* eslint-env jest */

import React from 'react';
import { customRender as render, screen } from '../../testUtils';
import QueryInput from './QueryInput';
import { queryModes } from '../../config';

test('Renders the query string text', () => {
  render(<QueryInput currentQueryMode={queryModes[0]} />);
  const titleElement = screen.getByText(new RegExp(queryModes[0], 'i'));
  expect(titleElement).toBeInTheDocument();
});
