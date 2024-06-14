import {
  DEFAULT_COMPRESSION_LEVEL,
  NO_FORMAT_SELECTED,
  formats,
} from "@/config";
import * as Module from "@/lib/formats";

describe("Functions manipulating the available download formats", () => {
  describe("selectFormat", () => {
    it("selects formats", () => {
      expect(
        Module.selectFormat(formats.fulltext.pdf, formats.fulltext.txt),
      ).toBe(formats.fulltext.pdf | formats.fulltext.txt);
    });
  });

  describe("deselectFormat", () => {
    it("deselects formats", () => {
      expect(
        Module.deselectFormat(
          formats.fulltext.pdf | formats.fulltext.txt,
          formats.fulltext.txt,
        ),
      ).toBe(formats.fulltext.pdf);
    });
  });

  describe("toggleFormat", () => {
    const formatsWithTxt = formats.fulltext.pdf | formats.fulltext.txt;
    const formatsWithoutTxt = formats.fulltext.pdf;

    it("selects a format when it's not already selected", () => {
      expect(Module.toggleFormat(formatsWithoutTxt, formats.fulltext.txt)).toBe(
        formatsWithTxt,
      );
    });

    it("deselects a format when it's already selected", () => {
      expect(Module.toggleFormat(formatsWithTxt, formats.fulltext.txt)).toBe(
        formatsWithoutTxt,
      );
    });
  });

  describe("isFormatSelected", () => {
    const formatsWithTxt = formats.fulltext.pdf | formats.fulltext.txt;
    const formatsWithoutTxt = formats.fulltext.pdf;

    it("detects when a format is selected", () => {
      expect(
        Module.isFormatSelected(formatsWithTxt, formats.fulltext.txt),
      ).toBe(true);
    });

    it("detects when a format is not selected", () => {
      expect(
        Module.isFormatSelected(formatsWithoutTxt, formats.fulltext.txt),
      ).toBe(false);
    });
  });

  describe("isWholeCategorySelected", () => {
    const metadataFormats =
      formats.metadata.json | formats.metadata.xml | formats.metadata.mods;

    it("detects when a category is selected", () => {
      expect(Module.isWholeCategorySelected(metadataFormats, "metadata")).toBe(
        true,
      );
    });

    it("detects when a category is not selected", () => {
      expect(
        Module.isWholeCategorySelected(formats.metadata.json, "metadata"),
      ).toBe(false);
    });

    it("detects when a category is selected even if formats from other categories are selected", () => {
      expect(
        Module.isWholeCategorySelected(
          metadataFormats | formats.fulltext.pdf,
          "metadata",
        ),
      ).toBe(true);
    });
  });

  describe("getWholeCategoryFormat", () => {
    it("generates the correct format for a category", () => {
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
        enrichmentsFormats,
      );
    });
  });

  describe("buildExtractParamsFromFormats", () => {
    it("generates the correct extract parameter", () => {
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

      const extractParams =
        Module.buildExtractParamsFromFormats(selectedFormats);
      expectedExtractParams.forEach((extractParam) => {
        expect(extractParams).toMatch(extractParam);
      });
    });

    it("generates an empty string when no formats are selected", () => {
      expect(Module.buildExtractParamsFromFormats(NO_FORMAT_SELECTED)).toBe("");
    });
  });

  describe("parseExtractParams", () => {
    it("extracts the formats from a correct extract parameter", () => {
      const correct =
        "fulltext[pdf,txt];metadata[json];enrichments[grobidFulltext];covers;annexes";

      expect(Module.parseExtractParams(correct)).toBe(
        formats.fulltext.pdf |
          formats.fulltext.txt |
          formats.enrichments.grobidFulltext |
          formats.metadata.json |
          formats.others.annexes |
          formats.others.covers,
      );
    });

    it("skips incorrect formats", () => {
      const wrongFormat = "fulltext[incorrect];metadata[json]";

      expect(Module.parseExtractParams(wrongFormat)).toBe(
        formats.metadata.json,
      );
    });

    it("skips incorrect categories", () => {
      const wrongCategory = "fulltext[pdf];incorrect[json]";
      const almostCorrectCategory = "fulltextERROR[pdf];metadata[json]";

      expect(Module.parseExtractParams(wrongCategory)).toBe(
        formats.fulltext.pdf,
      );
      expect(Module.parseExtractParams(almostCorrectCategory)).toBe(
        formats.metadata.json,
      );
    });

    it("skips formats not separated by a comma", () => {
      const missingComma =
        "fulltext[pdf,txt];metadata[jsonxml];enrichments[teeft,nb]";

      expect(Module.parseExtractParams(missingComma)).toBe(
        formats.fulltext.pdf |
          formats.fulltext.txt |
          formats.enrichments.teeft |
          formats.enrichments.nb,
      );
    });

    it("skips categories not separated by semicolons", () => {
      const missingSemiColon = "fulltext[pdf,txt]metadata[json]";

      expect(Module.parseExtractParams(missingSemiColon)).toBe(
        formats.fulltext.pdf | formats.fulltext.txt,
      );
    });
  });

  describe("estimateArchiveSize", () => {
    it("calculate the 'correct' file size", () => {
      const size = Module.estimateArchiveSize(
        formats.fulltext.pdf | formats.metadata.json,
        3,
        DEFAULT_COMPRESSION_LEVEL,
        "zip",
      );

      expect(size).toBeCloseTo(4855065.48);
    });
  });
});
