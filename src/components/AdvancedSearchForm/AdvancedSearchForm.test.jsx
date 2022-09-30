import React from 'react';
import AdvancedSearchForm from './AdvancedSearchForm';
import { describe, it } from 'vitest';
import { customRender as render } from '../../test/utils';

const queryInputHandler = newQueryStringInput => {
  return true;
};
describe('Tests for the AdvancedSearchForm component', () => {
  it('Renders the AdvancedSearchForm form', () => {
    render(<AdvancedSearchForm queryInputHandler={queryInputHandler} />);
  });
});
