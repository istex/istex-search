import type { SortField, SortOrder } from "./FacetCheckboxList";
import { ASC, DOC_COUNT, KEY } from "./FacetCheckboxList";
import type { FacetItem } from "./FacetContext";

export const sortFacets = (
  facets: FacetItem[],
  sortField: SortField,
  sortOrder: SortOrder,
) => {
  const sortedFacets = [...facets].sort((a, b) => {
    switch (sortField) {
      case KEY:
        if (sortOrder === ASC) {
          return a[sortField].toString().localeCompare(b[sortField].toString());
        } else {
          return b[sortField].toString().localeCompare(a[sortField].toString());
        }
      case DOC_COUNT:
        if (sortOrder === ASC) {
          return a[sortField] - b[sortField];
        } else {
          return b[sortField] - a[sortField];
        }
      default:
        return 0;
    }
  });
  return sortedFacets;
};

export const FACETS_RANGE_WITH_DECIMAL = ["qualityIndicators.score"];

export const checkRangeInputValue = (facetTitle: string, value: string) => {
  const withDecimal = FACETS_RANGE_WITH_DECIMAL.includes(facetTitle);
  return (
    // Bridle the number of decimals
    (!withDecimal || !value.includes(".") || value.split(".")[1].length <= 3) &&
    // Bridle the score input to the range
    ((facetTitle === "qualityIndicators.score" &&
      +value >= 0 &&
      +value <= 10) ||
      facetTitle !== "qualityIndicators.score") &&
    // Accept empty string
    ((!withDecimal && value === "") ||
      // Accept entire number (5)
      (!withDecimal && !isNaN(parseInt(value)) && /^[\d]+$/.test(value)) ||
      // Accept decimal number (5.3)
      (withDecimal && !isNaN(+value)) ||
      // Accept decimal number being written (5.)
      (withDecimal &&
        !isNaN(parseInt(value.slice(0, -1))) &&
        value.endsWith(".") &&
        Number.isInteger(value.slice(0, -1))))
  );
};
