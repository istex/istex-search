import { describe, expect, it } from 'vitest';

import * as Module from './formats';
import { formats } from '@/config';

describe('Tests for the functions manipulating the available download formats', () => {
  it('selectFormat', () => {
    expect(Module.selectFormat(formats.fulltext.formats.pdf.value, formats.fulltext.formats.txt.value)).toBe(formats.fulltext.formats.pdf.value | formats.fulltext.formats.txt.value);
  });

  it('deselectFormat', () => {
    expect(Module.deselectFormat(formats.fulltext.formats.pdf.value | formats.fulltext.formats.txt.value, formats.fulltext.formats.txt.value)).toBe(formats.fulltext.formats.pdf.value);
  });

  it('toggleFormat', () => {
    const formatsWithTxt = formats.fulltext.formats.pdf.value | formats.fulltext.formats.txt.value;
    const formatsWithoutTxt = formats.fulltext.formats.pdf.value;

    expect(Module.toggleFormat(formatsWithoutTxt, formats.fulltext.formats.txt.value)).toBe(formatsWithTxt);
    expect(Module.toggleFormat(formatsWithTxt, formats.fulltext.formats.txt.value)).toBe(formatsWithoutTxt);
  });

  it('noFormatSelected', () => {
    expect(Module.noFormatSelected()).toBe(0);
  });

  it('isFormatSelected', () => {
    const formatsWithTxt = formats.fulltext.formats.pdf.value | formats.fulltext.formats.txt.value;
    const formatsWithoutTxt = formats.fulltext.formats.pdf.value;

    expect(Module.isFormatSelected(formatsWithTxt, formats.fulltext.formats.txt.value)).toBe(true);
    expect(Module.isFormatSelected(formatsWithoutTxt, formats.fulltext.formats.txt.value)).toBe(false);
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

    expect(Module.getWholeCategoryFormat('fulltext')).toBe(fulltextFormats);
    expect(Module.getWholeCategoryFormat('metadata')).toBe(metadataFormats);
    expect(Module.getWholeCategoryFormat('enrichments')).toBe(enrichmentsFormats);
  });

  it('buildExtractParamsFromFormats', () => {
    const selectedFormats = formats.fulltext.formats.pdf.value |
      formats.fulltext.formats.txt.value |
      formats.enrichments.formats.grobidFulltext.value |
      formats.metadata.formats.json.value |
      formats.annexes.value |
      formats.covers.value;
    const noSelectedFormats = 0;

    const expectedExtractParams = [
      /fulltext\[pdf,txt\]/,
      /metadata\[json\]/,
      /enrichments\[grobidFulltext\]/,
      /covers/,
      /annexes/,
    ];

    const extractParams = Module.buildExtractParamsFromFormats(selectedFormats);
    expectedExtractParams.forEach(extractParam => expect(extractParams).toMatch(extractParam));
    expect(Module.buildExtractParamsFromFormats(noSelectedFormats)).toBe('');
  });

  it('parseExtractParams', () => {
    const correctExtractParams = 'fulltext[pdf,txt];metadata[json];enrichments[grobidFulltext];covers;annexes';
    const wrongFormatExtractParams = 'fulltext[incorrect];metadata[json]';
    const wrongCategoryExtractParams = 'fulltext[pdf];incorrect[json]';
    const missingCommaExtractParams = 'fulltext[pdf,txt];metadata[jsonxml];enrichments[teeft,nb]';
    const missingSemiColonExtractParams = 'fulltext[pdf,txt]metadata[json]';

    expect(Module.parseExtractParams(correctExtractParams)).toBe(formats.fulltext.formats.pdf.value |
      formats.fulltext.formats.txt.value |
      formats.enrichments.formats.grobidFulltext.value |
      formats.metadata.formats.json.value |
      formats.annexes.value |
      formats.covers.value);
    expect(Module.parseExtractParams(wrongFormatExtractParams)).toBe(formats.metadata.formats.json.value);
    expect(Module.parseExtractParams(wrongCategoryExtractParams)).toBe(formats.fulltext.formats.pdf.value);
    expect(Module.parseExtractParams(missingCommaExtractParams)).toBe(formats.fulltext.formats.pdf.value |
      formats.fulltext.formats.txt.value |
      formats.enrichments.formats.teeft.value |
      formats.enrichments.formats.nb.value);
    expect(Module.parseExtractParams(missingSemiColonExtractParams)).toBe(formats.fulltext.formats.pdf.value | formats.fulltext.formats.txt.value);
  });
});
