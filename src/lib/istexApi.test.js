import { describe, expect, it } from 'vitest';
import * as istexApi from './istexApi';
import { istexApiConfig, compressionLevels, formats } from '../config';

describe('Tests for the ISTEX API related functions', () => {
  it('buildQueryStringFromCorpusFile', () => {
    const corpusFileContent =
`#
# Fichier .corpus
#
query        : *
date         : 2022-3-11
total        : 5
[ISTEX]
ark ark:/67375/NVC-S58LP3M2-S
ark ark:/67375/NVC-RBP335V7-7
ark ark:/67375/NVC-8SNSRJ6Z-Z`;

    expect(istexApi.buildQueryStringFromCorpusFile(corpusFileContent)).to.equal('arkIstex.raw("ark:/67375/NVC-8SNSRJ6Z-Z" "ark:/67375/NVC-RBP335V7-7" "ark:/67375/NVC-S58LP3M2-S")');
  });

  it('buildQueryStringFromArks', () => {
    const arks = [
      'ark:/67375/NVC-8SNSRJ6Z-Z ',
      ' ark:/67375/NVC-RBP335V7-7',
      'ark:/67375/NVC-S58LP3M2-S ',
    ];

    expect(istexApi.buildQueryStringFromArks(arks)).to.equal('arkIstex.raw("ark:/67375/NVC-8SNSRJ6Z-Z" "ark:/67375/NVC-RBP335V7-7" "ark:/67375/NVC-S58LP3M2-S")');
  });

  it('isEmptyArkQueryString', () => {
    const emptyArkQueryString = 'arkIstex.raw("")';
    const nonEmptyArkQueryString = 'arkIstex.raw("ark:/67375/NVC-8SNSRJ6Z-Z")';
    const garbageInput = 'some garbage data';

    expect(istexApi.isEmptyArkQueryString(emptyArkQueryString)).to.equal(true);
    expect(istexApi.isEmptyArkQueryString(nonEmptyArkQueryString)).to.equal(false);
    expect(istexApi.isEmptyArkQueryString(garbageInput)).to.equal(false);
  });

  it('buildExtractParamsFromFormats', () => {
    const selectedFormats = formats.fulltext.pdf |
      formats.fulltext.txt |
      formats.enrichments.grobidFulltext |
      formats.metadata.json |
      formats.annexes |
      formats.covers;
    const noSelectedFormats = 0;

    expect(istexApi.buildExtractParamsFromFormats(selectedFormats)).to.equal('fulltext[pdf,txt];metadata[json];enrichments[grobidFulltext];covers;annexes');
    expect(istexApi.buildExtractParamsFromFormats(noSelectedFormats)).to.be.equal('');
  });

  it('parseExtractParams', () => {
    const correctExtractParams = 'fulltext[pdf,txt];metadata[json];enrichments[grobidFulltext];covers;annexes';
    const wrongFormatExtractParams = 'fulltext[incorrect];metadata[json]';
    const wrongCategoryExtractParams = 'fulltext[pdf];incorrect[json]';
    const missingCommaExtractParams = 'fulltext[pdf,txt];metadata[jsonxml];enrichments[teeft,nb]';
    const missingSemiColonExtractParams = 'fulltext[pdf,txt]metadata[json]';

    expect(istexApi.parseExtractParams(correctExtractParams)).to.equal(formats.fulltext.pdf |
      formats.fulltext.txt |
      formats.enrichments.grobidFulltext |
      formats.metadata.json |
      formats.annexes |
      formats.covers);
    expect(istexApi.parseExtractParams(wrongFormatExtractParams)).to.equal(formats.metadata.json);
    expect(istexApi.parseExtractParams(wrongCategoryExtractParams)).to.equal(formats.fulltext.pdf);
    expect(istexApi.parseExtractParams(missingCommaExtractParams)).to.equal(formats.fulltext.pdf |
      formats.fulltext.txt |
      formats.enrichments.teeft |
      formats.enrichments.nb);
    expect(istexApi.parseExtractParams(missingSemiColonExtractParams)).to.equal(formats.fulltext.pdf | formats.fulltext.txt);
  });

  it('buildFullUrl', () => {
    const queryStringRequest = {
      queryString: 'fulltext:fish',
      selectedFormats: formats.fulltext.pdf,
      rankingMode: istexApiConfig.rankingModes[0],
      numberOfDocuments: 1,
      compressionLevel: compressionLevels[0].value,
      archiveType: istexApiConfig.archiveTypes[0],
    };
    const qIdRequest = {
      qId: 'fakeQId',
      selectedFormats: formats.fulltext.pdf,
      rankingMode: istexApiConfig.rankingModes[0],
      numberOfDocuments: 1,
      compressionLevel: compressionLevels[0].value,
      archiveType: istexApiConfig.archiveTypes[0],
    };
    const noSelectedFormatsRequest = {
      selectedFormats: 0,
    };

    expect(istexApi.buildFullUrl(queryStringRequest).toString()).to.equal('https://api.istex.fr/document?q=fulltext%3Afish&extract=fulltext%5Bpdf%5D&size=1&rankBy=qualityOverRelevance&compressionLevel=0&archiveType=zip&sid=istex-dl');
    expect(istexApi.buildFullUrl(qIdRequest).toString()).to.equal('https://api.istex.fr/document?q_id=fakeQId&extract=fulltext%5Bpdf%5D&size=1&rankBy=qualityOverRelevance&compressionLevel=0&archiveType=zip&sid=istex-dl');
    expect(istexApi.buildFullUrl(noSelectedFormatsRequest)).to.equal(null);
  });

  it('selectFormat', () => {
    expect(istexApi.selectFormat(formats.fulltext.pdf, formats.fulltext.txt)).to.equal(formats.fulltext.pdf | formats.fulltext.txt);
  });

  it('deselectFormat', () => {
    expect(istexApi.deselectFormat(formats.fulltext.pdf | formats.fulltext.txt, formats.fulltext.txt)).to.equal(formats.fulltext.pdf);
  });

  it('toggleFormat', () => {
    const formatsWithTxt = formats.fulltext.pdf | formats.fulltext.txt;
    const formatsWithoutTxt = formats.fulltext.pdf;

    expect(istexApi.toggleFormat(formatsWithoutTxt, formats.fulltext.txt)).to.equal(formatsWithTxt);
    expect(istexApi.toggleFormat(formatsWithTxt, formats.fulltext.txt)).to.equal(formatsWithoutTxt);
  });

  it('resetFormat', () => {
    expect(istexApi.resetFormat()).to.equal(0);
  });

  it('isFormatSelected', () => {
    const formatsWithTxt = formats.fulltext.pdf | formats.fulltext.txt;
    const formatsWithoutTxt = formats.fulltext.pdf;

    expect(istexApi.isFormatSelected(formatsWithTxt, formats.fulltext.txt)).to.equal(true);
    expect(istexApi.isFormatSelected(formatsWithoutTxt, formats.fulltext.txt)).to.equal(false);
  });
});
