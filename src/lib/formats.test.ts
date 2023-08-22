import { describe, expect, it } from "@jest/globals";
import * as Module from "./formats";
import { NO_FORMAT_SELECTED, formats } from "@/config";

describe("Tests for the functions manipulating the available download formats", () => {
  it("selectFormat", () => {
    expect(
      Module.selectFormat(formats.fulltext.pdf, formats.fulltext.txt)
    ).toBe(formats.fulltext.pdf | formats.fulltext.txt);
  });

  it("deselectFormat", () => {
    expect(
      Module.deselectFormat(
        formats.fulltext.pdf | formats.fulltext.txt,
        formats.fulltext.txt
      )
    ).toBe(formats.fulltext.pdf);
  });

  it("toggleFormat", () => {
    const formatsWithTxt = formats.fulltext.pdf | formats.fulltext.txt;
    const formatsWithoutTxt = formats.fulltext.pdf;

    expect(Module.toggleFormat(formatsWithoutTxt, formats.fulltext.txt)).toBe(
      formatsWithTxt
    );

    expect(Module.toggleFormat(formatsWithTxt, formats.fulltext.txt)).toBe(
      formatsWithoutTxt
    );
  });

  it("isFormatSelected", () => {
    const formatsWithTxt = formats.fulltext.pdf | formats.fulltext.txt;
    const formatsWithoutTxt = formats.fulltext.pdf;

    expect(Module.isFormatSelected(formatsWithTxt, formats.fulltext.txt)).toBe(
      true
    );

    expect(
      Module.isFormatSelected(formatsWithoutTxt, formats.fulltext.txt)
    ).toBe(false);
  });

  it("isWholeCategorySelected", () => {
    const metadataFormats =
      formats.metadata.json | formats.metadata.xml | formats.metadata.mods;

    expect(Module.isWholeCategorySelected(metadataFormats, "metadata")).toBe(
      true
    );

    expect(
      Module.isWholeCategorySelected(formats.metadata.json, "metadata")
    ).toBe(false);

    expect(
      Module.isWholeCategorySelected(
        metadataFormats | formats.fulltext.pdf,
        "metadata"
      )
    ).toBe(true);
  });

  it("getWholeCategoryFormat", () => {
    const fulltextFormats =
      formats.fulltext.pdf |
      formats.fulltext.tei |
      formats.fulltext.txt |
      formats.fulltext.cleaned |
      formats.fulltext.zip |
      formats.fulltext.tiff;

    const metadataFormats =
      formats.metadata.json | formats.metadata.xml | formats.metadata.mods;

    const enrichmentsFormats =
      formats.enrichments.multicat |
      formats.enrichments.nb |
      formats.enrichments.grobidFulltext |
      formats.enrichments.refBibs |
      formats.enrichments.teeft |
      formats.enrichments.unitex;

    expect(Module.getWholeCategoryFormat("fulltext")).toBe(fulltextFormats);
    expect(Module.getWholeCategoryFormat("metadata")).toBe(metadataFormats);
    expect(Module.getWholeCategoryFormat("enrichments")).toBe(
      enrichmentsFormats
    );
  });

  it("buildExtractParamsFromFormats", () => {
    const selectedFormats =
      formats.fulltext.pdf |
      formats.fulltext.txt |
      formats.enrichments.grobidFulltext |
      formats.metadata.json |
      formats.others.annexes |
      formats.others.covers;

    const expectedExtractParams = [
      /fulltext\[pdf,txt\]/,
      /metadata\[json\]/,
      /enrichments\[grobidFulltext\]/,
      /covers/,
      /annexes/,
    ];

    const extractParams = Module.buildExtractParamsFromFormats(selectedFormats);
    expectedExtractParams.forEach((extractParam) => {
      expect(extractParams).toMatch(extractParam);
    });

    expect(Module.buildExtractParamsFromFormats(NO_FORMAT_SELECTED)).toBe("");
  });

  it("parseExtractParams", () => {
    const correctExtractParams =
      "fulltext[pdf,txt];metadata[json];enrichments[grobidFulltext];covers;annexes";
    const wrongFormatExtractParams = "fulltext[incorrect];metadata[json]";
    const wrongCategoryExtractParams = "fulltext[pdf];incorrect[json]";
    const missingCommaExtractParams =
      "fulltext[pdf,txt];metadata[jsonxml];enrichments[teeft,nb]";
    const missingSemiColonExtractParams = "fulltext[pdf,txt]metadata[json]";

    expect(Module.parseExtractParams(correctExtractParams)).toBe(
      formats.fulltext.pdf |
        formats.fulltext.txt |
        formats.enrichments.grobidFulltext |
        formats.metadata.json |
        formats.others.annexes |
        formats.others.covers
    );

    expect(Module.parseExtractParams(wrongFormatExtractParams)).toBe(
      formats.metadata.json
    );

    expect(Module.parseExtractParams(wrongCategoryExtractParams)).toBe(
      formats.fulltext.pdf
    );

    expect(Module.parseExtractParams(missingCommaExtractParams)).toBe(
      formats.fulltext.pdf |
        formats.fulltext.txt |
        formats.enrichments.teeft |
        formats.enrichments.nb
    );

    expect(Module.parseExtractParams(missingSemiColonExtractParams)).toBe(
      formats.fulltext.pdf | formats.fulltext.txt
    );
  });
});
