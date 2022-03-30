/* eslint-env jest */

import React from 'react';
import { customRender as render, screen } from '../../testUtils';
import QuerySection from './QuerySection';

test('Renders the query title', () => {
  render(<QuerySection />);
  const queryElements = screen.getAllByText(/Query/i);
  queryElements.forEach(queryElement => expect(queryElement).toBeInTheDocument());
});
