import type { FieldType, FieldName } from "@/lib/ast";

export interface Field {
  name: FieldName;
  type: FieldType;
  defaultOpen?: boolean;
  isDate?: boolean;
  hasDecimals?: boolean;
}

const fields: readonly Field[] = [
  {
    name: "corpusName",
    type: "text",
    defaultOpen: true,
  },
  {
    name: "language",
    type: "language",
    defaultOpen: true,
  },
  {
    name: "publicationDate",
    type: "number",
    defaultOpen: true,
    isDate: true,
  },
  {
    name: "host.genre",
    type: "text",
    defaultOpen: true,
  },
  {
    name: "genre",
    type: "text",
    defaultOpen: true,
  },
  {
    name: "enrichments.type",
    type: "text",
    defaultOpen: true,
  },
  {
    name: "categories.wos",
    type: "text",
  },
  {
    name: "categories.scienceMetrix",
    type: "text",
  },
  {
    name: "categories.scopus",
    type: "text",
  },
  {
    name: "categories.inist",
    type: "text",
  },
  {
    name: "qualityIndicators.pdfWordCount",
    type: "number",
  },
  {
    name: "qualityIndicators.pdfCharCount",
    type: "number",
  },
  {
    name: "qualityIndicators.score",
    type: "number",
    hasDecimals: true,
  },
  {
    name: "qualityIndicators.pdfVersion",
    type: "text",
  },
  {
    name: "qualityIndicators.refBibsNative",
    type: "boolean",
  },
];

export default fields;
