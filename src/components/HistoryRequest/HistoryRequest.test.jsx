import React from 'react';
import { describe, expect, it } from 'vitest';
import { customRender as render, screen } from '../../test/utils';
import HistoryRequest from './HistoryRequest';

describe('Tests for the App component', () => {
  it.skip('Renders the request date', () => {
    render(<HistoryRequest requestInfo={{ index: 0, date: 123, queryString: 'fulltext:fish' }} />);
    const queryStringElement = screen.getByText(/fulltext:fish/i);

    expect(queryStringElement).toBeInTheDocument();
  });
});
