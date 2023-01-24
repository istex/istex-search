import { describe, expect, it } from 'vitest';
import { buildFullApiUrl } from './istexApi';
import { istexApiConfig, formats } from '@/config';

describe('Tests for the Istex API related functions', () => {
  it('buildFullApiUrl', () => {
    const queryStringRequest = {
      queryString: 'fulltext:fish',
      selectedFormats: formats.fulltext.formats.pdf.value,
      rankingMode: istexApiConfig.rankingModes.getDefault().value,
      numberOfDocuments: 1,
      compressionLevel: istexApiConfig.compressionLevels.getDefault().value,
      archiveType: istexApiConfig.archiveTypes.getDefault().value,
    };
    const qIdRequest = {
      qId: 'fakeQId',
      selectedFormats: formats.fulltext.formats.pdf.value,
      rankingMode: istexApiConfig.rankingModes.getDefault().value,
      numberOfDocuments: 1,
      compressionLevel: istexApiConfig.compressionLevels.getDefault().value,
      archiveType: istexApiConfig.archiveTypes.getDefault().value,
    };
    const noSelectedFormatsRequest = {
      selectedFormats: 0,
    };

    expect(buildFullApiUrl(queryStringRequest).toString()).toBe('https://api.istex.fr/document?q=fulltext%3Afish&extract=fulltext%5Bpdf%5D&size=1&rankBy=qualityOverRelevance&compressionLevel=6&archiveType=zip&sid=istex-dl');
    expect(buildFullApiUrl(qIdRequest).toString()).toBe('https://api.istex.fr/document?q_id=fakeQId&extract=fulltext%5Bpdf%5D&size=1&rankBy=qualityOverRelevance&compressionLevel=6&archiveType=zip&sid=istex-dl');
    expect(buildFullApiUrl(noSelectedFormatsRequest)).toBe(null);
  });
});
