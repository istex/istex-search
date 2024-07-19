export const fields = [
  {
    name: "author.affiliations",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "host.author.affiliations",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "arkIstex",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "corpusName",
    type: "text",
    requiresFetchingValues: true,
    implicitNodes: [],
  },
  {
    name: "categories.inist",
    type: "text",
    requiresFetchingValues: true,
    implicitNodes: [],
  },
  {
    name: "categories.scienceMetrix",
    type: "text",
    requiresFetchingValues: true,
    implicitNodes: [],
  },
  {
    name: "categories.scopus",
    type: "text",
    requiresFetchingValues: true,
    implicitNodes: [],
  },
  {
    name: "categories.wos",
    type: "text",
    requiresFetchingValues: true,
    implicitNodes: [],
  },
  {
    name: "figure",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "table",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "fulltext@1",
    type: "text",
    requiresFetchingValues: false,
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
    name: "publicationDate",
    type: "number",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "refBibs.publicationDate",
    type: "number",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "refBibs.doi",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "host.doi",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "serie.doi",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "doi",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "host.eisbn",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "host.eissn",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "serie.eissn",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "hasFormula",
    type: "boolean",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "host.isbn",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "host.issn",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "serie.issn",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "language",
    type: "text",
    requiresFetchingValues: true,
    implicitNodes: [],
  },
  {
    name: "host.language",
    type: "text",
    requiresFetchingValues: true,
    implicitNodes: [],
  },
  {
    name: "subject.lang",
    type: "text",
    requiresFetchingValues: true,
    implicitNodes: [],
  },
  {
    name: "accessCondition.contentType",
    type: "text",
    requiresFetchingValues: true,
    implicitNodes: [],
  },
  {
    name: "subject.value",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "host.subject.value",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "keywords.teeft",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "author.name",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "refBibs.author.name",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "host.author.name",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "refBibs.host.author.name",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "namedEntities.unitex.orgName",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "namedEntities.unitex.orgName_funder",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "host.conference.name",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "serie.conference.name",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "namedEntities.unitex.placeName",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "namedEntities.unitex.geogName",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "namedEntities.unitex.persName",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "namedEntities.unitex.date",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "qualityIndicators.pdfCharCount",
    type: "number",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "qualityIndicators.abstractCharCount",
    type: "number",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "qualityIndicators.pdfWordCount",
    type: "number",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "qualityIndicators.abstractWordCount",
    type: "number",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "qualityIndicators.pdfWordsPerPage",
    type: "number",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "qualityIndicators.pdfPageCount",
    type: "number",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "host.issue",
    type: "number",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "serie.issue",
    type: "number",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "qualityIndicators.pdfText",
    type: "boolean",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "qualityIndicators.refBibsNative",
    type: "boolean",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "abstract",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "qualityIndicators.score",
    type: "number",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "qualityIndicators.teiSource",
    type: "text",
    requiresFetchingValues: true,
    implicitNodes: [],
  },
  {
    name: "fulltext",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "title",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "refBibs.title",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "host.title",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "serie.title",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "refBibs.host.title",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "refBibs.serie.title",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "qualityIndicators.tdmReady",
    type: "boolean",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "enrichments.type",
    type: "text",
    requiresFetchingValues: true,
    implicitNodes: [],
  },
  {
    name: "genre",
    type: "text",
    requiresFetchingValues: true,
    implicitNodes: [],
  },
  {
    name: "accessCondition.value",
    type: "text",
    requiresFetchingValues: true,
    implicitNodes: [],
  },
  {
    name: "host.genre",
    type: "text",
    requiresFetchingValues: true,
    implicitNodes: [],
  },
  {
    name: "namedEntities.unitex.ref_url",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "qualityIndicators.pdfVersion",
    type: "text",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "host.volume",
    type: "number",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
  {
    name: "refBibs.host.volume",
    type: "number",
    requiresFetchingValues: false,
    implicitNodes: [],
  },
] as const;
