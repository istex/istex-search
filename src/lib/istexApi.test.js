import { describe, expect, it } from 'vitest';
import * as istexApi from './istexApi';
import { istexApiConfig, formats } from '../config';

describe('Tests for the Istex API related functions', () => {
  it('parseCorpusFileContent', () => {
    const completeCorpusFileContent =
`#
# Fichier .corpus
#
query        : *
date         : 2022-3-11
total        : 5
[ISTEX]

ark   ark:/67375/NVC-S58LP3M2-S    # very cool comment
ark ark:/67375/NVC-RBP335V7-7    # very cool comment

ark  ark:/67375/NVC-8SNSRJ6Z-Z    # very cool comment
id    B940A8D3FD96AB383C6393070933764A2CE3D106   # very cool comment
id CAE51D9B29CBA1B8C81A136946C75A51055C7066  # very cool comment
id  59E080581FC0350BC92AD9975484E4127E8803A0 # very cool comment`;

    const onlyArksCorpusFileContent =
`#
# Fichier .corpus
#
query        : *
date         : 2022-3-11
total        : 5
[ISTEX]

ark   ark:/67375/NVC-S58LP3M2-S    # very cool comment
ark ark:/67375/NVC-RBP335V7-7    # very cool comment
ark  ark:/67375/NVC-8SNSRJ6Z-Z    # very cool comment`;

    const onlyIstexIdsCorpusFileContent =
`#
# Fichier .corpus
#
query        : *
date         : 2022-3-11
total        : 5
[ISTEX]
id    B940A8D3FD96AB383C6393070933764A2CE3D106   # very cool comment
id CAE51D9B29CBA1B8C81A136946C75A51055C7066  # very cool comment
id  59E080581FC0350BC92AD9975484E4127E8803A0 # very cool comment`;

    const invalidLineCorpusFileContent =
`#
# Fichier .corpus
#
query        : *
date         : 2022-3-11
total        : 5
[ISTEX]
ark  ark:/67375/NVC-S58LP3M2-S
   
garbage line

ark  ark:/67375/NVC-RBP335V7-7
ark  ark:/67375/NVC-8SNSRJ6Z-Z`;

    const completeExpectedQueryString = 'arkIstex.raw:("ark:/67375/NVC-8SNSRJ6Z-Z" "ark:/67375/NVC-RBP335V7-7" "ark:/67375/NVC-S58LP3M2-S") OR id:("59E080581FC0350BC92AD9975484E4127E8803A0" "CAE51D9B29CBA1B8C81A136946C75A51055C7066" "B940A8D3FD96AB383C6393070933764A2CE3D106")';
    const parsedCompleteCorpusFileContent = istexApi.parseCorpusFileContent(completeCorpusFileContent);
    expect(parsedCompleteCorpusFileContent.queryString).toBe(completeExpectedQueryString);
    expect(parsedCompleteCorpusFileContent.numberOfIds).toBe(6);

    const onlyArksExpectedQueryString = 'arkIstex.raw:("ark:/67375/NVC-8SNSRJ6Z-Z" "ark:/67375/NVC-RBP335V7-7" "ark:/67375/NVC-S58LP3M2-S")';
    const parsedOnlyArksCorpusFileContent = istexApi.parseCorpusFileContent(onlyArksCorpusFileContent);
    expect(parsedOnlyArksCorpusFileContent.queryString).toBe(onlyArksExpectedQueryString);
    expect(parsedOnlyArksCorpusFileContent.numberOfIds).toBe(3);

    const onlyIstexIdsExpectedQueryString = 'id:("59E080581FC0350BC92AD9975484E4127E8803A0" "CAE51D9B29CBA1B8C81A136946C75A51055C7066" "B940A8D3FD96AB383C6393070933764A2CE3D106")';
    const parsedOnlyIstexIdsCorpusFileContent = istexApi.parseCorpusFileContent(onlyIstexIdsCorpusFileContent);
    expect(parsedOnlyIstexIdsCorpusFileContent.queryString).toBe(onlyIstexIdsExpectedQueryString);
    expect(parsedOnlyIstexIdsCorpusFileContent.numberOfIds).toBe(3);

    expect(() => istexApi.parseCorpusFileContent(invalidLineCorpusFileContent)).toThrow();
  });

  it('buildQueryStringFromArks', () => {
    const arks = [
      'ark:/67375/NVC-8SNSRJ6Z-Z ',
      ' ark:/67375/NVC-RBP335V7-7',
      'ark:/67375/NVC-S58LP3M2-S ',
    ];

    const expectedQueryString = 'arkIstex.raw:("ark:/67375/NVC-8SNSRJ6Z-Z" "ark:/67375/NVC-RBP335V7-7" "ark:/67375/NVC-S58LP3M2-S")';
    expect(istexApi.buildQueryStringFromArks(arks)).toBe(expectedQueryString);
  });

  it('buildQueryStringFromIstexIds', () => {
    const istexIds = [
      '59E080581FC0350BC92AD9975484E4127E8803A0',
      'CAE51D9B29CBA1B8C81A136946C75A51055C7066',
      'B940A8D3FD96AB383C6393070933764A2CE3D106',
    ];

    const expectedQueryString = 'id:("59E080581FC0350BC92AD9975484E4127E8803A0" "CAE51D9B29CBA1B8C81A136946C75A51055C7066" "B940A8D3FD96AB383C6393070933764A2CE3D106")';
    expect(istexApi.buildQueryStringFromIstexIds(istexIds)).toBe(expectedQueryString);
  });

  it('isArkQueryString', () => {
    const correctArkQueryString = 'arkIstex.raw:("ark:/67375/NVC-15SZV86B-F" "ark:/67375/NVC-XMM4B8LD-H")';
    const badArkQueryString = 'arkIstex.raw:("ark1" "ark2")';
    const garbageString = 'foo:bar';

    expect(istexApi.isArkQueryString(correctArkQueryString)).toBe(true);
    expect(istexApi.isArkQueryString(badArkQueryString)).toBe(false);
    expect(istexApi.isArkQueryString(garbageString)).toBe(false);
  });

  it('getArksFromArkQueryString', () => {
    const singleArkQueryString = 'arkIstex.raw:("ark:/67375/NVC-15SZV86B-F")';
    const multipleArkQueryString = 'arkIstex.raw:("ark:/67375/NVC-15SZV86B-F" "ark:/67375/NVC-XMM4B8LD-H")';

    expect(istexApi.getArksFromArkQueryString(singleArkQueryString)).toEqual(['ark:/67375/NVC-15SZV86B-F']);
    expect(istexApi.getArksFromArkQueryString(multipleArkQueryString)).toEqual(['ark:/67375/NVC-15SZV86B-F', 'ark:/67375/NVC-XMM4B8LD-H']);
  });

  it('isIstexIdQueryString', () => {
    const correctIstexIdQueryString = 'id:("1234" "5678")';
    const garbageString = 'foo:bar';

    expect(istexApi.isIstexIdQueryString(correctIstexIdQueryString)).toBe(true);
    expect(istexApi.isIstexIdQueryString(garbageString)).toBe(false);
  });

  it('getIstexIdsFromIstexIdQueryString', () => {
    const singleIstexIdQueryString = 'id:("1234")';
    const multipleIstexIdsQueryString = 'id:("1234" "5678")';

    expect(istexApi.getIstexIdsFromIstexIdQueryString(singleIstexIdQueryString)).toEqual(['1234']);
    expect(istexApi.getIstexIdsFromIstexIdQueryString(multipleIstexIdsQueryString)).toEqual(['1234', '5678']);
  });

  it('buildExtractParamsFromFormats', () => {
    const selectedFormats = formats.fulltext.formats.pdf.value |
      formats.fulltext.formats.txt.value |
      formats.enrichments.formats.grobidFulltext.value |
      formats.metadata.formats.json.value |
      formats.annexes.value |
      formats.covers.value;
    const noSelectedFormats = 0;

    const expectedFormats = [
      /fulltext\[pdf,txt\]/,
      /metadata\[json\]/,
      /enrichments\[grobidFulltext\]/,
      /covers/,
      /annexes/,
    ];
    for (let f = 0; f < expectedFormats.length; f++) {
      expect(istexApi.buildExtractParamsFromFormats(selectedFormats)).toMatch(expectedFormats[f]);
    }
    expect(istexApi.buildExtractParamsFromFormats(noSelectedFormats)).toBe('');
  });

  it('parseExtractParams', () => {
    const correctExtractParams = 'fulltext[pdf,txt];metadata[json];enrichments[grobidFulltext];covers;annexes';
    const wrongFormatExtractParams = 'fulltext[incorrect];metadata[json]';
    const wrongCategoryExtractParams = 'fulltext[pdf];incorrect[json]';
    const missingCommaExtractParams = 'fulltext[pdf,txt];metadata[jsonxml];enrichments[teeft,nb]';
    const missingSemiColonExtractParams = 'fulltext[pdf,txt]metadata[json]';

    expect(istexApi.parseExtractParams(correctExtractParams)).toBe(formats.fulltext.formats.pdf.value |
      formats.fulltext.formats.txt.value |
      formats.enrichments.formats.grobidFulltext.value |
      formats.metadata.formats.json.value |
      formats.annexes.value |
      formats.covers.value);
    expect(istexApi.parseExtractParams(wrongFormatExtractParams)).toBe(formats.metadata.formats.json.value);
    expect(istexApi.parseExtractParams(wrongCategoryExtractParams)).toBe(formats.fulltext.formats.pdf.value);
    expect(istexApi.parseExtractParams(missingCommaExtractParams)).toBe(formats.fulltext.formats.pdf.value |
      formats.fulltext.formats.txt.value |
      formats.enrichments.formats.teeft.value |
      formats.enrichments.formats.nb.value);
    expect(istexApi.parseExtractParams(missingSemiColonExtractParams)).toBe(formats.fulltext.formats.pdf.value | formats.fulltext.formats.txt.value);
  });

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

    expect(istexApi.buildFullApiUrl(queryStringRequest).toString()).toBe('https://api.istex.fr/document?q=fulltext%3Afish&extract=fulltext%5Bpdf%5D&size=1&rankBy=qualityOverRelevance&compressionLevel=6&archiveType=zip&sid=istex-dl');
    expect(istexApi.buildFullApiUrl(qIdRequest).toString()).toBe('https://api.istex.fr/document?q_id=fakeQId&extract=fulltext%5Bpdf%5D&size=1&rankBy=qualityOverRelevance&compressionLevel=6&archiveType=zip&sid=istex-dl');
    expect(istexApi.buildFullApiUrl(noSelectedFormatsRequest)).toBe(null);
  });

  it('selectFormat', () => {
    expect(istexApi.selectFormat(formats.fulltext.formats.pdf.value, formats.fulltext.formats.txt.value)).toBe(formats.fulltext.formats.pdf.value | formats.fulltext.formats.txt.value);
  });

  it('deselectFormat', () => {
    expect(istexApi.deselectFormat(formats.fulltext.formats.pdf.value | formats.fulltext.formats.txt.value, formats.fulltext.formats.txt.value)).toBe(formats.fulltext.formats.pdf.value);
  });

  it('toggleFormat', () => {
    const formatsWithTxt = formats.fulltext.formats.pdf.value | formats.fulltext.formats.txt.value;
    const formatsWithoutTxt = formats.fulltext.formats.pdf.value;

    expect(istexApi.toggleFormat(formatsWithoutTxt, formats.fulltext.formats.txt.value)).toBe(formatsWithTxt);
    expect(istexApi.toggleFormat(formatsWithTxt, formats.fulltext.formats.txt.value)).toBe(formatsWithoutTxt);
  });

  it('noFormatSelected', () => {
    expect(istexApi.noFormatSelected()).toBe(0);
  });

  it('isFormatSelected', () => {
    const formatsWithTxt = formats.fulltext.formats.pdf.value | formats.fulltext.formats.txt.value;
    const formatsWithoutTxt = formats.fulltext.formats.pdf.value;

    expect(istexApi.isFormatSelected(formatsWithTxt, formats.fulltext.formats.txt.value)).toBe(true);
    expect(istexApi.isFormatSelected(formatsWithoutTxt, formats.fulltext.formats.txt.value)).toBe(false);
  });

  it('getWholeCategoryFormat', () => {
    const fulltextFormats = formats.fulltext.formats.pdf.value |
      formats.fulltext.formats.tei.value |
      formats.fulltext.formats.txt.value |
      formats.fulltext.formats.cleaned.value |
      formats.fulltext.formats.zip.value |
      formats.fulltext.formats.tiff.value;

    const metadataFormats = formats.metadata.formats.json.value |
      formats.metadata.formats.xml.value |
      formats.metadata.formats.mods.value;

    const enrichmentsFormats = formats.enrichments.formats.multicat.value |
      formats.enrichments.formats.nb.value |
      formats.enrichments.formats.grobidFulltext.value |
      formats.enrichments.formats.refBibs.value |
      formats.enrichments.formats.teeft.value |
      formats.enrichments.formats.unitex.value;

    expect(istexApi.getWholeCategoryFormat('fulltext')).toBe(fulltextFormats);
    expect(istexApi.getWholeCategoryFormat('metadata')).toBe(metadataFormats);
    expect(istexApi.getWholeCategoryFormat('enrichments')).toBe(enrichmentsFormats);
  });
});
