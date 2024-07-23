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
