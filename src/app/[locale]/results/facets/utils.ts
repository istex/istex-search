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

/**
 * Function to get the language name from the iso code in the user language given
 * @param language user language to use to translate the iso code
 * @param iso iso code of the language
 * @returns the iso language name in the user language given
 */
export function isoToLanguage(language: string, iso: string) {
  const dictionary = new Intl.DisplayNames([language], { type: "language" });
  try {
    return dictionary.of(iso);
  } catch {
    return iso;
  }
}

export const getLanguageLabel = (
  iso: string,
  locale: string,
  t: (key: string) => string,
) => {
  if (iso === "unknown") return t("language.unknown");
  const languageName = isoToLanguage(locale, iso);
  if (languageName !== undefined) return languageName;
  return iso;
};

export const FACETS_RANGE_WITH_DECIMAL = ["qualityIndicators.score"];

export const checkRangeInputValue = (facetTitle: string, value: string) => {
  const withDecimal = FACETS_RANGE_WITH_DECIMAL.includes(facetTitle);
  return (
    // Bridle the number of decimals
    (!withDecimal ||
      (withDecimal && !value.includes(".")) ||
      (withDecimal && value.split(".")[1].length <= 3)) &&
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
        value.slice(-1) === "." &&
        Number.isInteger(value.slice(0, -1))))
  );
};
