import { describe, expect, it } from 'vitest';
import * as utils from './utils';

describe('Tests for the utility functions', () => {
  it('isValidMd5', () => {
    const validMd5 = '1bc29b36f623ba82aaf6724fd3b16718';
    const invalidMd5 = 'abc';
    const invalidArg = 3;

    expect(utils.isValidMd5(validMd5)).to.equal(true);
    expect(utils.isValidMd5(invalidMd5)).to.equal(false);
    expect(utils.isValidMd5(invalidArg)).to.equal(false);
  });
});
