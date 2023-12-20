import FacetAutocomplete from "./FacetAutocomplete";
import FacetCheckboxList from "./FacetCheckboxList";

export const FACETS = [
  {
    name: "corpusName",
    requestOption: "[*]",
    component: FacetCheckboxList,
  },
  {
    name: "categories.wos",
    requestOption: "[*]",
    component: FacetCheckboxList,
  },
  {
    name: "enrichments.type",
    requestOption: "[*]",
    component: FacetCheckboxList,
  },
  {
    name: "language",
    requestOption: "[*]",
    component: FacetAutocomplete,
  },
  {
    name: "categories.scienceMetrix",
    requestOption: "[*]",
    component: FacetCheckboxList,
  },
  {
    name: "categories.scopus",
    requestOption: "[*]",
    component: FacetCheckboxList,
  },
];

export const INDICATORS_FACETS = [
  { name: "qualityIndicators.abstractCharCount", requestOption: "[1-1000000]" },
  { name: "qualityIndicators.pdfText" },
  { name: "qualityIndicators.tdmReady" },
  { name: "language", requestOption: "[*]" },
];

export const COMPATIBILITY_FACETS = [
  { name: "qualityIndicators.teiSource" },
  { name: "qualityIndicators.tdmReady" },
  { name: "enrichments.type", requestOption: "[*]" },
];
