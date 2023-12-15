import FacetCheckboxList from "./FacetCheckboxList";

export const FACETS = [
  {
    name: "corpusName",
    requestOption: "[*]",
    component: FacetCheckboxList,
  },
];

export const INDICATORS_FACETS = [
  { name: "qualityIndicators.abstractCharCount", requestOption: "[1-1000000]" },
  { name: "qualityIndicators.pdfText" },
  { name: "qualityIndicators.tdmReady" },
  { name: "language", requestOption: "[3]" },
];

export const COMPATIBILITY_FACETS = [
  { name: "qualityIndicators.teiSource" },
  { name: "qualityIndicators.tdmReady" },
  { name: "enrichments.type", requestOption: "[*]" },
];
