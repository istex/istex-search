import type { AST, Comparator } from "./ast";

export const fieldNames = [
  "corpusName",
  "language",
  "publicationDate",
  "host.genre",
  "genre",
  "enrichments.type",
  "categories.wos",
  "categories.scienceMetrix",
  "categories.scopus",
  "categories.inist",
  "qualityIndicators.pdfWordCount",
  "qualityIndicators.pdfCharCount",
  "qualityIndicators.score",
  "qualityIndicators.pdfVersion",
  "qualityIndicators.refBibsNative",
  "author.affiliations",
  "host.author.affiliations",
  "arkIstex",
  "figure",
  "table",
  "fulltext@1",
  "refBibs.publicationDate",
  "refBibs.doi",
  "host.doi",
  "serie.doi",
  "doi",
  "host.eisbn",
  "host.eissn",
  "serie.eissn",
  "hasFormula",
  "host.isbn",
  "host.issn",
  "serie.issn",
  "host.language",
  "subject.lang",
  "accessCondition.contentType",
  "subject.value",
  "host.subject.value",
  "keywords.teeft",
  "author.name",
  "refBibs.author.name",
  "host.author.name",
  "refBibs.host.author.name",
  "namedEntities.unitex.orgName",
  "namedEntities.unitex.orgName_funder",
  "host.conference.name",
  "serie.conference.name",
  "namedEntities.unitex.placeName",
  "namedEntities.unitex.geogName",
  "namedEntities.unitex.persName",
  "namedEntities.unitex.date",
  "qualityIndicators.abstractCharCount",
  "qualityIndicators.abstractWordCount",
  "qualityIndicators.pdfWordsPerPage",
  "qualityIndicators.pdfPageCount",
  "host.issue",
  "serie.issue",
  "qualityIndicators.pdfText",
  "abstract",
  "qualityIndicators.teiSource",
  "fulltext",
  "title",
  "refBibs.title",
  "host.title",
  "serie.title",
  "refBibs.host.title",
  "refBibs.serie.title",
  "qualityIndicators.tdmReady",
  "accessCondition.value",
  "namedEntities.unitex.ref_url",
  "host.volume",
  "refBibs.host.volume",
] as const;
export type FieldName = (typeof fieldNames)[number];

export const fieldTypes = ["text", "language", "number", "boolean"] as const;
export type FieldType = (typeof fieldTypes)[number];

export interface Field {
  name: FieldName;
  type: FieldType;
  inFilters?: boolean;
  defaultOpen?: boolean;
  isDate?: boolean;
  hasDecimals?: boolean;
  requiresLabeling?: boolean;
  requiresFetchingValues?: boolean;
  implicitNodes?: AST;
  comparators?: Comparator[];
}

const fields: readonly Field[] = [
  {
    name: "corpusName",
    type: "text",
    inFilters: true,
    defaultOpen: true,
    requiresFetchingValues: true,
  },
  {
    name: "language",
    type: "language",
    inFilters: true,
    defaultOpen: true,
    requiresFetchingValues: true,
  },
  {
    name: "publicationDate",
    type: "number",
    inFilters: true,
    defaultOpen: true,
    isDate: true,
  },
  {
    name: "host.genre",
    type: "text",
    inFilters: true,
    defaultOpen: true,
    requiresLabeling: true,
    requiresFetchingValues: true,
    comparators: ["equals"],
  },
  {
    name: "genre",
    type: "text",
    inFilters: true,
    defaultOpen: true,
    requiresLabeling: true,
    requiresFetchingValues: true,
    comparators: ["equals"],
  },
  {
    name: "enrichments.type",
    type: "text",
    inFilters: true,
    defaultOpen: true,
    requiresLabeling: true,
    requiresFetchingValues: true,
    comparators: ["equals"],
  },
  {
    name: "categories.wos",
    type: "text",
    inFilters: true,
    requiresFetchingValues: true,
  },
  {
    name: "categories.scienceMetrix",
    type: "text",
    inFilters: true,
    requiresFetchingValues: true,
  },
  {
    name: "categories.scopus",
    type: "text",
    inFilters: true,
    requiresFetchingValues: true,
  },
  {
    name: "categories.inist",
    type: "text",
    inFilters: true,
    requiresFetchingValues: true,
  },
  {
    name: "qualityIndicators.pdfWordCount",
    type: "number",
    inFilters: true,
  },
  {
    name: "qualityIndicators.pdfCharCount",
    type: "number",
    inFilters: true,
  },
  {
    name: "qualityIndicators.score",
    type: "number",
    inFilters: true,
    hasDecimals: true,
  },
  {
    name: "qualityIndicators.pdfVersion",
    type: "text",
    inFilters: true,
    requiresFetchingValues: true,
    comparators: ["equals"],
  },
  {
    name: "qualityIndicators.refBibsNative",
    type: "boolean",
    inFilters: true,
    requiresLabeling: true,
  },
  {
    name: "author.affiliations",
    type: "text",
  },
  {
    name: "host.author.affiliations",
    type: "text",
  },
  {
    name: "arkIstex",
    type: "text",
    comparators: ["equals"],
  },
  {
    name: "figure",
    type: "text",
    comparators: ["contains"],
  },
  {
    name: "table",
    type: "text",
    comparators: ["contains"],
  },
  {
    name: "fulltext@1",
    type: "text",
    implicitNodes: [
      {
        nodeType: "node",
        fieldType: "boolean",
        field: "qualityIndicators.tdmReady",
        value: true,
        comparator: "equals",
      },
    ],
    comparators: ["contains"],
  },
  {
    name: "refBibs.publicationDate",
    type: "number",
    isDate: true,
  },
  {
    name: "refBibs.doi",
    type: "text",
    comparators: ["equals"],
  },
  {
    name: "host.doi",
    type: "text",
    comparators: ["equals"],
  },
  {
    name: "serie.doi",
    type: "text",
    comparators: ["equals"],
  },
  {
    name: "doi",
    type: "text",
    comparators: ["equals"],
  },
  {
    name: "host.eisbn",
    type: "text",
    comparators: ["equals"],
  },
  {
    name: "host.eissn",
    type: "text",
    comparators: ["equals"],
  },
  {
    name: "serie.eissn",
    type: "text",
    comparators: ["equals"],
  },
  {
    name: "hasFormula",
    type: "boolean",
  },
  {
    name: "host.isbn",
    type: "text",
    comparators: ["equals"],
  },
  {
    name: "host.issn",
    type: "text",
    comparators: ["equals"],
  },
  {
    name: "serie.issn",
    type: "text",
    comparators: ["equals"],
  },
  {
    name: "host.language",
    type: "language",
    requiresFetchingValues: true,
  },
  {
    name: "subject.lang",
    type: "language",
    requiresFetchingValues: true,
  },
  {
    name: "accessCondition.contentType",
    type: "text",
    requiresFetchingValues: true,
    comparators: ["equals"],
  },
  {
    name: "subject.value",
    type: "text",
  },
  {
    name: "host.subject.value",
    type: "text",
  },
  {
    name: "keywords.teeft",
    type: "text",
  },
  {
    name: "author.name",
    type: "text",
  },
  {
    name: "refBibs.author.name",
    type: "text",
  },
  {
    name: "host.author.name",
    type: "text",
  },
  {
    name: "refBibs.host.author.name",
    type: "text",
  },
  {
    name: "namedEntities.unitex.orgName",
    type: "text",
  },
  {
    name: "namedEntities.unitex.orgName_funder",
    type: "text",
  },
  {
    name: "host.conference.name",
    type: "text",
  },
  {
    name: "serie.conference.name",
    type: "text",
  },
  {
    name: "namedEntities.unitex.placeName",
    type: "text",
  },
  {
    name: "namedEntities.unitex.geogName",
    type: "text",
  },
  {
    name: "namedEntities.unitex.persName",
    type: "text",
  },
  {
    name: "namedEntities.unitex.date",
    type: "text",
  },
  {
    name: "qualityIndicators.abstractCharCount",
    type: "number",
  },
  {
    name: "qualityIndicators.abstractWordCount",
    type: "number",
  },
  {
    name: "qualityIndicators.pdfWordsPerPage",
    type: "number",
  },
  {
    name: "qualityIndicators.pdfPageCount",
    type: "number",
  },
  {
    name: "host.issue",
    type: "number",
  },
  {
    name: "serie.issue",
    type: "number",
  },
  {
    name: "qualityIndicators.pdfText",
    type: "boolean",
  },
  {
    name: "abstract",
    type: "text",
  },
  {
    name: "qualityIndicators.teiSource",
    type: "text",
    requiresFetchingValues: true,
    comparators: ["equals"],
  },
  {
    name: "fulltext",
    type: "text",
    comparators: ["contains"],
  },
  {
    name: "title",
    type: "text",
  },
  {
    name: "refBibs.title",
    type: "text",
  },
  {
    name: "host.title",
    type: "text",
  },
  {
    name: "serie.title",
    type: "text",
  },
  {
    name: "refBibs.host.title",
    type: "text",
  },
  {
    name: "refBibs.serie.title",
    type: "text",
  },
  {
    name: "qualityIndicators.tdmReady",
    type: "boolean",
  },
  {
    name: "accessCondition.value",
    type: "text",
    requiresFetchingValues: true,
    comparators: ["equals", "startsWith", "endsWith"],
  },
  {
    name: "namedEntities.unitex.ref_url",
    type: "text",
  },
  {
    name: "host.volume",
    type: "number",
  },
  {
    name: "refBibs.host.volume",
    type: "number",
  },
];

export default fields;
