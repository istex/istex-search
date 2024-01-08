import type { AST } from "./queryAst";

// NOTE: This file is temporary and only used for testing the AST types.
// It should be removed once the types are finished.

// (
//  corpusName.raw:elsevier
//  AND
//  publicationDate:[2010 TO *]
//  OR
//  (
//   abstract:"rings of Saturn"
//   OR
//   subject.value.raw:Astrophysics
//   AND NOT
//   subject.value.raw:mythology
//   AND
//   (
//     hasFormula:true
//     AND
//     fulltext:helium
//   )
//  )
//  AND
//  qualityIndicators.tdmReady:true
// )

export const ast: AST = [
  {
    nodeType: "node",
    fieldType: "text",
    field: "corpusName",
    value: "elsevier",
    comparator: "equals",
  },
  {
    nodeType: "operator",
    value: "AND",
  },
  {
    nodeType: "node",
    fieldType: "range",
    field: "publicationDate",
    min: 2010,
    max: 2020,
    comparator: "between",
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
        comparator: "equals",
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
        comparator: "notEquals",
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
            value: true,
            comparator: "equals",
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
    value: true,
    comparator: "equals",
  },
];
