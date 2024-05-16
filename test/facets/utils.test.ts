import * as Module from "@/app/[locale]/results/components/Facets/utils";

describe("sortFacets", () => {
  it("should sort facets by key in ascending order", () => {
    const facets = [
      { key: "b", docCount: 3, selected: false, excluded: false },
      { key: "c", docCount: 2, selected: false, excluded: false },
      { key: "a", docCount: 1, selected: false, excluded: false },
    ];
    const sortField = "key";
    const sortOrder = "asc";

    const sortedFacets = Module.sortFacets(facets, sortField, sortOrder);

    expect(sortedFacets).toEqual([
      { key: "a", docCount: 1, selected: false, excluded: false },
      { key: "b", docCount: 3, selected: false, excluded: false },
      { key: "c", docCount: 2, selected: false, excluded: false },
    ]);
  });

  it("should sort facets by key in descending order", () => {
    const facets = [
      { key: "b", docCount: 3, selected: false, excluded: false },
      { key: "c", docCount: 2, selected: false, excluded: false },
      { key: "a", docCount: 1, selected: false, excluded: false },
    ];
    const sortField = "key";
    const sortOrder = "desc";

    const sortedFacets = Module.sortFacets(facets, sortField, sortOrder);

    expect(sortedFacets).toEqual([
      { key: "c", docCount: 2, selected: false, excluded: false },
      { key: "b", docCount: 3, selected: false, excluded: false },
      { key: "a", docCount: 1, selected: false, excluded: false },
    ]);
  });

  it("should sort facets by docCount in ascending order", () => {
    const facets = [
      { key: "a", docCount: 1, selected: false, excluded: false },
      { key: "b", docCount: 3, selected: false, excluded: false },
      { key: "c", docCount: 2, selected: false, excluded: false },
    ];
    const sortField = "docCount";
    const sortOrder = "asc";

    const sortedFacets = Module.sortFacets(facets, sortField, sortOrder);

    expect(sortedFacets).toEqual([
      { key: "a", docCount: 1, selected: false, excluded: false },
      { key: "c", docCount: 2, selected: false, excluded: false },
      { key: "b", docCount: 3, selected: false, excluded: false },
    ]);
  });

  it("should sort facets by docCount in descending order", () => {
    const facets = [
      { key: "a", docCount: 1, selected: false, excluded: false },
      { key: "b", docCount: 3, selected: false, excluded: false },
      { key: "c", docCount: 2, selected: false, excluded: false },
    ];
    const sortField = "docCount";
    const sortOrder = "desc";

    const sortedFacets = Module.sortFacets(facets, sortField, sortOrder);

    expect(sortedFacets).toEqual([
      { key: "b", docCount: 3, selected: false, excluded: false },
      { key: "c", docCount: 2, selected: false, excluded: false },
      { key: "a", docCount: 1, selected: false, excluded: false },
    ]);
  });
});

describe("isoToLanguage", () => {
  it(`should return the language corresponding to the iso code`, () => {
    expect(Module.isoToLanguage("fr-FR", "fr")).toBe("français");
    expect(Module.isoToLanguage("en-EN", "en")).toBe("English");
    expect(Module.isoToLanguage("en-EN", "fr")).toBe("French");
    expect(Module.isoToLanguage("en-EN", "de")).toBe("German");
    expect(Module.isoToLanguage("en-EN", "es")).toBe("Spanish");
    expect(Module.isoToLanguage("en-EN", "it")).toBe("Italian");
    expect(Module.isoToLanguage("en-EN", "pt")).toBe("Portuguese");
    expect(Module.isoToLanguage("en-EN", "ru")).toBe("Russian");
    expect(Module.isoToLanguage("en-EN", "zh")).toBe("Chinese");
    expect(Module.isoToLanguage("en-EN", "ja")).toBe("Japanese");
    expect(Module.isoToLanguage("en-EN", "ko")).toBe("Korean");
    expect(Module.isoToLanguage("en-EN", "ar")).toBe("Arabic");
    expect(Module.isoToLanguage("en-EN", "he")).toBe("Hebrew");
    expect(Module.isoToLanguage("en-EN", "la")).toBe("Latin");
    expect(Module.isoToLanguage("en-EN", "el")).toBe("Greek");
    expect(Module.isoToLanguage("en-EN", "hi")).toBe("Hindi");
    expect(Module.isoToLanguage("en-EN", "fa")).toBe("Persian");
    expect(Module.isoToLanguage("en-EN", "tr")).toBe("Turkish");
    expect(Module.isoToLanguage("en-EN", "nl")).toBe("Dutch");
    expect(Module.isoToLanguage("en-EN", "sv")).toBe("Swedish");
    expect(Module.isoToLanguage("en-EN", "pl")).toBe("Polish");
    expect(Module.isoToLanguage("en-EN", "cs")).toBe("Czech");
    expect(Module.isoToLanguage("en-EN", "no")).toBe("Norwegian");
    expect(Module.isoToLanguage("en-EN", "da")).toBe("Danish");
    expect(Module.isoToLanguage("en-EN", "fi")).toBe("Finnish");
    expect(Module.isoToLanguage("en-EN", "hu")).toBe("Hungarian");
    expect(Module.isoToLanguage("en-EN", "ro")).toBe("Romanian");
    expect(Module.isoToLanguage("en-EN", "uk")).toBe("Ukrainian");
    expect(Module.isoToLanguage("en-EN", "bg")).toBe("Bulgarian");
    expect(Module.isoToLanguage("en-EN", "vi")).toBe("Vietnamese");
    expect(Module.isoToLanguage("en-EN", "th")).toBe("Thai");
    expect(Module.isoToLanguage("en-EN", "id")).toBe("Indonesian");
    expect(Module.isoToLanguage("en-EN", "ms")).toBe("Malay");
    expect(Module.isoToLanguage("en-EN", "et")).toBe("Estonian");
    expect(Module.isoToLanguage("en-EN", "lv")).toBe("Latvian");
    expect(Module.isoToLanguage("en-EN", "lt")).toBe("Lithuanian");
    expect(Module.isoToLanguage("en-EN", "sr")).toBe("Serbian");
    expect(Module.isoToLanguage("en-EN", "sk")).toBe("Slovak");
    expect(Module.isoToLanguage("en-EN", "sl")).toBe("Slovenian");
    expect(Module.isoToLanguage("en-EN", "hr")).toBe("Croatian");
    expect(Module.isoToLanguage("en-EN", "tl")).toBe("Filipino");
  });
  it(`should return the iso code if the language is not supported`, () => {
    expect(Module.isoToLanguage("en-EN", "abc")).toBe("abc");
  });
});

describe("getLanguageLabel", () => {
  it("should return the translated label for a known language", () => {
    const iso = "en";
    const locale = "fr";
    const t = (key: string) => key;

    const result = Module.getLanguageLabel(iso, locale, t);

    expect(result).toBe("anglais");
  });

  it("should use t function when ISO code is 'unknown'", () => {
    const iso = "unknown";
    const locale = "fr";
    const t = (key: string) => key;

    const result = Module.getLanguageLabel(iso, locale, t);

    expect(result).toBe("language.unknown");
  });

  it("should return the ISO code for an unknown language if no translation is available", () => {
    const iso = "roa";
    const locale = "fr";
    const t = (key: string) => key;

    const result = Module.getLanguageLabel(iso, locale, t);

    expect(result).toBe("roa");
  });
});

describe("Module.checkRangeInputValue", () => {
  it("should return false for number with more than 3 decimals", () => {
    expect(
      Module.checkRangeInputValue("qualityIndicators.score", "1.2345"),
    ).toBe(false);
  });
  it("should return true for number with 3 decimals", () => {
    expect(
      Module.checkRangeInputValue("qualityIndicators.score", "1.234"),
    ).toBe(true);
  });
  it("should return true for valid score input", () => {
    expect(Module.checkRangeInputValue("qualityIndicators.score", "5")).toBe(
      true,
    );
    expect(Module.checkRangeInputValue("qualityIndicators.score", "5.")).toBe(
      true,
    );
    expect(Module.checkRangeInputValue("qualityIndicators.score", "5.3")).toBe(
      true,
    );
    expect(Module.checkRangeInputValue("qualityIndicators.score", "10")).toBe(
      true,
    );
  });

  it("should return true for valid non-score input", () => {
    expect(Module.checkRangeInputValue("otherFacet", "5")).toBe(true);
    expect(Module.checkRangeInputValue("otherFacet", "")).toBe(true);
    expect(Module.checkRangeInputValue("otherFacet", "1000000")).toBe(true);
  });

  it("should return false for invalid score input", () => {
    expect(Module.checkRangeInputValue("qualityIndicators.score", "-1")).toBe(
      false,
    );
    expect(Module.checkRangeInputValue("qualityIndicators.score", "11")).toBe(
      false,
    );
    expect(Module.checkRangeInputValue("qualityIndicators.score", "abc")).toBe(
      false,
    );
  });

  it("should return false for invalid non-score input", () => {
    expect(Module.checkRangeInputValue("otherFacet", "5.3")).toBe(false);
    expect(Module.checkRangeInputValue("otherFacet", "5.")).toBe(false);
    expect(Module.checkRangeInputValue("otherFacet", "abc")).toBe(false);
  });
});
