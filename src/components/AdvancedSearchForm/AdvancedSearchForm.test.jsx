import React from 'react';
import AdvancedSearchForm from './AdvancedSearchForm';
import { describe, it } from 'vitest';
import { customRender as render } from '../../test/utils';
import { catalogList } from '../../config';

describe('Tests for the AdvancedSearchForm component', () => {
  it('Renders the AdvancedSearchForm form', () => {
    render(<AdvancedSearchForm catalogList={catalogList} />);
  });
});
