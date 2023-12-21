import { sortFacets } from "@/app/[locale]/results/facets/utils";

describe("sortFacets", () => {
  it("should sort facets by key in ascending order", () => {
    const facets = [
      { key: "b", docCount: 3, selected: false },
      { key: "c", docCount: 2, selected: false },
      { key: "a", docCount: 1, selected: false },
    ];
    const sortField = "key";
    const sortOrder = "asc";

    const sortedFacets = sortFacets(facets, sortField, sortOrder);

    expect(sortedFacets).toEqual([
      { key: "a", docCount: 1, selected: false },
      { key: "b", docCount: 3, selected: false },
      { key: "c", docCount: 2, selected: false },
    ]);
  });

  it("should sort facets by key in descending order", () => {
    const facets = [
      { key: "b", docCount: 3, selected: false },
      { key: "c", docCount: 2, selected: false },
      { key: "a", docCount: 1, selected: false },
    ];
    const sortField = "key";
    const sortOrder = "desc";

    const sortedFacets = sortFacets(facets, sortField, sortOrder);

    expect(sortedFacets).toEqual([
      { key: "c", docCount: 2, selected: false },
      { key: "b", docCount: 3, selected: false },
      { key: "a", docCount: 1, selected: false },
    ]);
  });

  it("should sort facets by docCount in ascending order", () => {
    const facets = [
      { key: "a", docCount: 1, selected: false },
      { key: "b", docCount: 3, selected: false },
      { key: "c", docCount: 2, selected: false },
    ];
    const sortField = "docCount";
    const sortOrder = "asc";

    const sortedFacets = sortFacets(facets, sortField, sortOrder);

    expect(sortedFacets).toEqual([
      { key: "a", docCount: 1, selected: false },
      { key: "c", docCount: 2, selected: false },
      { key: "b", docCount: 3, selected: false },
    ]);
  });

  it("should sort facets by docCount in descending order", () => {
    const facets = [
      { key: "a", docCount: 1, selected: false },
      { key: "b", docCount: 3, selected: false },
      { key: "c", docCount: 2, selected: false },
    ];
    const sortField = "docCount";
    const sortOrder = "desc";

    const sortedFacets = sortFacets(facets, sortField, sortOrder);

    expect(sortedFacets).toEqual([
      { key: "b", docCount: 3, selected: false },
      { key: "c", docCount: 2, selected: false },
      { key: "a", docCount: 1, selected: false },
    ]);
  });
});
