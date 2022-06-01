import { describe, expect, it } from 'vitest';
import * as utils from './utils';
import { istexApiConfig, formats, usages } from '../config';

describe('Tests for the utility functions', () => {
  it('isValidMd5', () => {
    const validMd5 = '1bc29b36f623ba82aaf6724fd3b16718';
    const invalidMd5 = 'abc';
    const invalidArg = 3;

    expect(utils.isValidMd5(validMd5)).toBe(true);
    expect(utils.isValidMd5(invalidMd5)).toBe(false);
    expect(utils.isValidMd5(invalidArg)).toBe(false);
  });

  it('buildFullIstexDlUrl', () => {
    const queryStringRequest = {
      queryString: 'fulltext:fish',
      selectedFormats: formats.fulltext.pdf,
      rankingMode: istexApiConfig.rankingModes.getDefault(),
      numberOfDocuments: 1,
      compressionLevel: istexApiConfig.compressionLevels.getDefault().value,
      archiveType: istexApiConfig.archiveTypes.getDefault(),
      usage: Object.keys(usages)[0],
    };
    const queryStringWithLodexUsageRequest = {
      queryString: 'fulltext:fish',
      selectedFormats: usages.lodex.selectedFormats,
      rankingMode: istexApiConfig.rankingModes.getDefault(),
      numberOfDocuments: 1,
      compressionLevel: istexApiConfig.compressionLevels.getDefault().value,
      archiveType: istexApiConfig.archiveTypes.getDefault(),
      usage: Object.keys(usages)[1],
    };
    const qIdRequest = {
      qId: 'fakeQId',
      selectedFormats: formats.fulltext.pdf,
      rankingMode: istexApiConfig.rankingModes.getDefault(),
      numberOfDocuments: 1,
      compressionLevel: istexApiConfig.compressionLevels.getDefault().value,
      archiveType: istexApiConfig.archiveTypes.getDefault(),
      usage: Object.keys(usages)[0],
    };
    const noSelectedFormatsRequest = {
      selectedFormats: 0,
    };

    expect(utils.buildFullIstexDlUrl(queryStringRequest).toString()).toBe(`${window.location.href}?q=fulltext%3Afish&extract=fulltext%5Bpdf%5D&size=1&rankBy=qualityOverRelevance&compressionLevel=6&archiveType=zip&usage=customUsage`);
    expect(utils.buildFullIstexDlUrl(queryStringWithLodexUsageRequest).toString()).toBe(`${window.location.href}?q=fulltext%3Afish&extract=metadata%5Bjson%5D&size=1&rankBy=qualityOverRelevance&compressionLevel=6&archiveType=zip&usage=lodex`);
    expect(utils.buildFullIstexDlUrl(qIdRequest).toString()).toBe(`${window.location.href}?q_id=fakeQId&extract=fulltext%5Bpdf%5D&size=1&rankBy=qualityOverRelevance&compressionLevel=6&archiveType=zip&usage=customUsage`);
    expect(utils.buildFullIstexDlUrl(noSelectedFormatsRequest)).toBe(null);
  });
});
