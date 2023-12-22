// TODO: remove this file when tests are okay for Istex team
export const ast = [
  {
    nodeType: "node",
    fieldType: "text",
    field: "corpusName",
    value: "elsevier",
    comparator: "equal",
  },
  {
    nodeType: "operator",
    value: "AND",
  },
  {
    nodeType: "node",
    fieldType: "range",
    field: "publicationDate",
    min: "2010",
    max: "*",
    inclusive: "both",
    comparator: "isBetween",
  },
  {
    nodeType: "operator",
    value: "OR",
  },
  {
    nodeType: "group",
    nodes: [
      {
        nodeType: "node",
        fieldType: "text",
        field: "abstract",
        value: "rings of Saturn",
        comparator: "contains",
      },
      {
        nodeType: "operator",
        value: "OR",
      },
      {
        nodeType: "node",
        fieldType: "text",
        field: "subject.value",
        value: "Astrophysics",
        comparator: "equal",
      },
      {
        nodeType: "operator",
        value: "AND",
      },
      {
        nodeType: "node",
        fieldType: "text",
        field: "subject.value",
        value: "mythology",
        comparator: "notEqual",
      },
      {
        nodeType: "operator",
        value: "AND",
      },
      {
        nodeType: "group",
        nodes: [
          {
            nodeType: "node",
            fieldType: "boolean",
            field: "hasFormula",
            value: "true",
            comparator: "equal",
          },
          {
            nodeType: "operator",
            value: "AND",
          },
          {
            nodeType: "node",
            fieldType: "text",
            field: "fulltext",
            value: "helium",
            comparator: "contains",
          },
        ],
      },
    ],
  },
  {
    nodeType: "operator",
    value: "AND",
  },
  {
    nodeType: "node",
    fieldType: "boolean",
    field: "qualityIndicators.tdmReady",
    value: "true",
    comparator: "equal",
  },
];
