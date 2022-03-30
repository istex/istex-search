/* eslint-env jest */

import React from 'react';
import { customRender as render, screen } from '../../testUtils';
import UrlSearchParamsManager from './UrlSearchParamsManager';

test('Does not render anything', () => {
  render(<UrlSearchParamsManager />);
  const titleElement = screen.queryByText(/UrlSearchParamsManager/i);
  expect(titleElement).not.toBeInTheDocument();
});
