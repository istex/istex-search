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
          return a[sortField].localeCompare(b[sortField]);
        } else {
          return b[sortField].localeCompare(a[sortField]);
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
