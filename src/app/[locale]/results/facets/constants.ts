export const ASC = "asc";
export const DESC = "desc";

export const FACETS = [
  {
    name: "corpusName",
    requestOption: "[*]",
  },
];

export const INDICATORS_FACETS = [
  { name: "qualityIndicators.abstractCharCount", requestOption: "[1-1000000]" },
  { name: "qualityIndicators.pdfText" },
  { name: "qualityIndicators.tdmReady" },
  { name: "language", requestOption: "[3]" },
];
