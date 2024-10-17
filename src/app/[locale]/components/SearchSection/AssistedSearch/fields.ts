import type { AST, Comparator, FieldName, FieldType } from "@/lib/ast";

export interface Field {
  name: FieldName;
  type: FieldType;
  requiresFetchingValues?: boolean;
  implicitNodes?: AST;
  comparators?: Comparator[];
}

const fields: readonly Field[] = [
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
  },
  {
    name: "corpusName",
    type: "text",
    requiresFetchingValues: true,
  },
  {
    name: "categories.inist",
    type: "text",
    requiresFetchingValues: true,
  },
  {
    name: "categories.scienceMetrix",
    type: "text",
    requiresFetchingValues: true,
  },
  {
    name: "categories.scopus",
    type: "text",
    requiresFetchingValues: true,
  },
  {
    name: "categories.wos",
    type: "text",
    requiresFetchingValues: true,
  },
  {
    name: "figure",
    type: "text",
  },
  {
    name: "table",
    type: "text",
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
    name: "publicationDate",
    type: "number",
  },
  {
    name: "refBibs.publicationDate",
    type: "number",
  },
  {
    name: "refBibs.doi",
    type: "text",
  },
  {
    name: "host.doi",
    type: "text",
  },
  {
    name: "serie.doi",
    type: "text",
  },
  {
    name: "doi",
    type: "text",
  },
  {
    name: "host.eisbn",
    type: "text",
  },
  {
    name: "host.eissn",
    type: "text",
  },
  {
    name: "serie.eissn",
    type: "text",
  },
  {
    name: "hasFormula",
    type: "boolean",
  },
  {
    name: "host.isbn",
    type: "text",
  },
  {
    name: "host.issn",
    type: "text",
  },
  {
    name: "serie.issn",
    type: "text",
  },
  {
    name: "language",
    type: "language",
    requiresFetchingValues: true,
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
    name: "qualityIndicators.pdfCharCount",
    type: "number",
  },
  {
    name: "qualityIndicators.abstractCharCount",
    type: "number",
  },
  {
    name: "qualityIndicators.pdfWordCount",
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
    name: "qualityIndicators.refBibsNative",
    type: "boolean",
  },
  {
    name: "abstract",
    type: "text",
  },
  {
    name: "qualityIndicators.score",
    type: "number",
  },
  {
    name: "qualityIndicators.teiSource",
    type: "text",
    requiresFetchingValues: true,
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
    name: "enrichments.type",
    type: "text",
    requiresFetchingValues: true,
  },
  {
    name: "genre",
    type: "text",
    requiresFetchingValues: true,
  },
  {
    name: "accessCondition.value",
    type: "text",
    requiresFetchingValues: true,
    comparators: ["equals", "startsWith", "endsWith"],
  },
  {
    name: "host.genre",
    type: "text",
    requiresFetchingValues: true,
  },
  {
    name: "namedEntities.unitex.ref_url",
    type: "text",
  },
  {
    name: "qualityIndicators.pdfVersion",
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
