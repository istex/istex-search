export const fields = [
  {
    name: "author.affiliations",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "categories.inist",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "categories.scienceMetrix",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "categories.scopus",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "categories.wos",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "namedEntities.unitex.ref_bibl",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "figure",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "table",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "hasFormula",
    type: "boolean",
    implicitNodes: [],
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
  },
  {
    name: "corpusName",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "publicationDate",
    type: "number",
    implicitNodes: [],
  },
  {
    name: "refBibs.publicationDate",
    type: "number",
    implicitNodes: [],
  },
  {
    name: "serie.doi",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "doi",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "refBibs.doi",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "host.doi",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "host.eisbn",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "serie.eissn",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "host.eissn",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "host.isbn",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "serie.issn",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "host.issn",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "language",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "subject.lang",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "accessCondition.contentType",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "subject.value",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "keywords.teeft",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "namedEntities.unitex.placeName",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "namedEntities.unitex.geogName",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "namedEntities.unitex.persName",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "namedEntities.unitex.orgName",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "namedEntities.unitex.orgName_funder",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "namedEntities.unitex.orgName_provider",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "namedEntities.unitex.date",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "qualityIndicators.pdfCharCount",
    type: "number",
    implicitNodes: [],
  },
  {
    name: "qualityIndicators.abstractCharCount",
    type: "number",
    implicitNodes: [],
  },
  {
    name: "qualityIndicators.pdfWordCount",
    type: "number",
    implicitNodes: [],
  },
  {
    name: "qualityIndicators.abstractWordCount",
    type: "number",
    implicitNodes: [],
  },
  {
    name: "qualityIndicators.pdfWordsPerPage",
    type: "number",
    implicitNodes: [],
  },
  {
    name: "qualityIndicators.pdfPageCount",
    type: "number",
    implicitNodes: [],
  },
  {
    name: "author.name",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "refBibs.author.name",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "qualityIndicators.pdfText",
    type: "boolean",
    implicitNodes: [],
  },
  {
    name: "namedEntities.unitex.bibl",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "qualityIndicators.refBibsNative",
    type: "boolean",
    implicitNodes: [],
  },
  {
    name: "abstract",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "qualityIndicators.teiSource",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "fulltext",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "title",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "refBibs.title",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "serie.title",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "host.title",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "qualityIndicators.tdmReady",
    type: "boolean",
    implicitNodes: [],
  },
  {
    name: "genre",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "accessCondition.value",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "host.genre",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "namedEntities.unitex.ref_url",
    type: "text",
    implicitNodes: [],
  },
  {
    name: "qualityIndicators.pdfVersion",
    type: "text",
    implicitNodes: [],
  },
] as const;
