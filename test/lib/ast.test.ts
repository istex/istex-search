import * as Module from "@/lib/ast";
import type { Field } from "@/lib/fields";

describe("astToString", () => {
  it("skips partial nodes", () => {
    const ast: Module.AST = [
      {
        nodeType: "node",
        fieldType: "text",
        field: "abstract",
        value: "foo",
        comparator: "contains",
      },
      {
        nodeType: "operator",
        value: "OR",
      },
      {
        nodeType: "node",
        fieldType: "text",
        field: "abstract",
        value: "bar",
        comparator: "contains",
        partial: true,
      },
    ];

    expect(Module.astToString(ast)).toBe('abstract:"foo"');
  });

  describe("text nodes", () => {
    it("handles the contains comparator", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "text",
          field: "abstract",
          value: "bar",
          comparator: "contains",
        },
      ];

      expect(Module.astToString(ast)).toBe('abstract:"bar"');
    });

    it("escapes special characters with the contains comparator", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "text",
          field: "abstract",
          value: 'hello (world) + "foo"',
          comparator: "contains",
        },
      ];

      expect(Module.astToString(ast)).toBe(
        'abstract:"hello (world) + \\"foo\\""',
      );
    });

    it("handles the equals comparator", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "text",
          field: "abstract",
          value: "bar",
          comparator: "equals",
        },
      ];

      expect(Module.astToString(ast)).toBe('abstract.raw:"bar"');
    });

    it("escapes special characters with the equals comparator", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "text",
          field: "abstract",
          value: 'hello (world) + "foo"',
          comparator: "equals",
        },
      ];

      expect(Module.astToString(ast)).toBe(
        'abstract.raw:"hello (world) + \\"foo\\""',
      );
    });

    it("handles the startsWith comparator", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "text",
          field: "abstract",
          value: "bar",
          comparator: "startsWith",
        },
      ];

      expect(Module.astToString(ast)).toBe("abstract.raw:bar*");
    });

    it("escapes special characters with the startsWith comparator", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "text",
          field: "abstract",
          value: "foo+ bar*",
          comparator: "startsWith",
        },
      ];

      expect(Module.astToString(ast)).toBe("abstract.raw:foo\\+\\ bar\\**");
    });

    it("handles the endsWith comparator", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "text",
          field: "abstract",
          value: "bar",
          comparator: "endsWith",
        },
      ];

      expect(Module.astToString(ast)).toBe("abstract.raw:*bar");
    });

    it("escapes special characters with the endsWith comparator", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "text",
          field: "abstract",
          value: "foo+ bar*",
          comparator: "endsWith",
        },
      ];

      expect(Module.astToString(ast)).toBe("abstract.raw:*foo\\+\\ bar\\*");
    });
  });

  describe("language nodes", () => {
    it("handles the equals comparator", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "language",
          field: "language",
          value: "eng",
          comparator: "equals",
        },
      ];

      expect(Module.astToString(ast)).toBe('language.raw:"eng"');
    });
  });

  describe("number nodes", () => {
    it("handles the equals comparator", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "number",
          field: "qualityIndicators.pdfWordCount",
          value: 3,
          comparator: "equals",
        },
      ];

      expect(Module.astToString(ast)).toBe("qualityIndicators.pdfWordCount:3");
    });

    it("handles the smaller comparator", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "number",
          field: "qualityIndicators.pdfWordCount",
          value: 3,
          comparator: "smaller",
        },
      ];

      expect(Module.astToString(ast)).toBe("qualityIndicators.pdfWordCount:<3");
    });

    it("handles the greater comparator", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "number",
          field: "qualityIndicators.pdfWordCount",
          value: 3,
          comparator: "greater",
        },
      ];

      expect(Module.astToString(ast)).toBe("qualityIndicators.pdfWordCount:>3");
    });

    it("handles the between comparator", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "number",
          field: "qualityIndicators.pdfWordCount",
          min: 3,
          max: 5,
          comparator: "between",
        },
      ];

      expect(Module.astToString(ast)).toBe(
        "qualityIndicators.pdfWordCount:[3 TO 5]",
      );
    });
  });

  describe("boolean nodes", () => {
    it("handles the equals comparator", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "boolean",
          field: "qualityIndicators.tdmReady",
          value: false,
          comparator: "equals",
        },
      ];

      expect(Module.astToString(ast)).toBe("qualityIndicators.tdmReady:false");
    });
  });

  describe("nodes with implicit nodes", () => {
    it("handles single implicit nodes", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "text",
          field: "fulltext",
          value: "foo",
          implicitNodes: [
            {
              nodeType: "node",
              fieldType: "boolean",
              field: "qualityIndicators.tdmReady",
              value: true,
              comparator: "equals",
            },
          ],
          comparator: "contains",
        },
      ];

      expect(Module.astToString(ast)).toBe(
        '(fulltext:"foo" AND qualityIndicators.tdmReady:true)',
      );
    });

    it("handles complex implicit nodes", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "text",
          field: "fulltext",
          value: "foo",
          implicitNodes: [
            {
              nodeType: "node",
              fieldType: "boolean",
              field: "qualityIndicators.tdmReady",
              value: true,
              comparator: "equals",
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
                  fieldType: "number",
                  field: "qualityIndicators.abstractWordCount",
                  value: 5,
                  comparator: "greater",
                },
                {
                  nodeType: "operator",
                  value: "OR",
                },
                {
                  nodeType: "node",
                  fieldType: "number",
                  field: "qualityIndicators.pdfWordCount",
                  value: 5,
                  comparator: "greater",
                },
              ],
            },
          ],
          comparator: "contains",
        },
      ];

      expect(Module.astToString(ast)).toBe(
        '(fulltext:"foo" AND qualityIndicators.tdmReady:true AND (qualityIndicators.abstractWordCount:>5 OR qualityIndicators.pdfWordCount:>5))',
      );
    });
  });

  describe("operator nodes", () => {
    it("handles joining text nodes with operator OR", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "text",
          field: "abstract",
          value: "bar",
          comparator: "contains",
        },
        {
          nodeType: "operator",
          value: "OR",
        },
        {
          nodeType: "node",
          fieldType: "text",
          field: "abstract",
          value: "buzz",
          comparator: "contains",
        },
      ];

      expect(Module.astToString(ast)).toBe('abstract:"bar" OR abstract:"buzz"');
    });

    it("handles joining text nodes with operator AND", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "text",
          field: "abstract",
          value: "bar",
          comparator: "contains",
        },
        {
          nodeType: "operator",
          value: "AND",
        },
        {
          nodeType: "node",
          fieldType: "text",
          field: "abstract",
          value: "buzz",
          comparator: "contains",
        },
      ];

      expect(Module.astToString(ast)).toBe(
        'abstract:"bar" AND abstract:"buzz"',
      );
    });

    it("handles joining text nodes with operator NOT", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "text",
          field: "abstract",
          value: "bar",
          comparator: "contains",
        },
        {
          nodeType: "operator",
          value: "NOT",
        },
        {
          nodeType: "node",
          fieldType: "text",
          field: "abstract",
          value: "buzz",
          comparator: "contains",
        },
      ];

      expect(Module.astToString(ast)).toBe(
        'abstract:"bar" NOT abstract:"buzz"',
      );
    });

    it("omits the operator if the previous node is partial", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "text",
          field: "abstract",
          value: "bar",
          comparator: "contains",
          partial: true,
        },
        {
          nodeType: "operator",
          value: "OR",
        },
        {
          nodeType: "node",
          fieldType: "text",
          field: "abstract",
          value: "buzz",
          comparator: "contains",
        },
      ];

      expect(Module.astToString(ast)).toBe('abstract:"buzz"');
    });

    it("omits the operator if the next node is partial", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "text",
          field: "abstract",
          value: "bar",
          comparator: "contains",
        },
        {
          nodeType: "operator",
          value: "OR",
        },
        {
          nodeType: "node",
          fieldType: "text",
          field: "abstract",
          value: "buzz",
          comparator: "contains",
          partial: true,
        },
      ];

      expect(Module.astToString(ast)).toBe('abstract:"bar"');
    });
  });

  describe("group nodes", () => {
    it("handles group nodes", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "text",
          field: "abstract",
          value: "bar",
          comparator: "contains",
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
              fieldType: "text",
              field: "abstract",
              value: "buzz",
              comparator: "contains",
            },
            {
              nodeType: "operator",
              value: "OR",
            },
            {
              nodeType: "node",
              fieldType: "text",
              field: "abstract",
              value: "world",
              comparator: "contains",
            },
          ],
        },
      ];

      expect(Module.astToString(ast)).toBe(
        'abstract:"bar" AND (abstract:"buzz" OR abstract:"world")',
      );
    });

    it("omits the parentheses if the group is the root node", () => {
      const ast: Module.AST = [
        {
          nodeType: "group",
          root: true,
          nodes: [
            {
              nodeType: "node",
              fieldType: "text",
              field: "abstract",
              value: "buzz",
              comparator: "contains",
            },
            {
              nodeType: "operator",
              value: "OR",
            },
            {
              nodeType: "node",
              fieldType: "text",
              field: "abstract",
              value: "world",
              comparator: "contains",
            },
          ],
        },
      ];

      expect(Module.astToString(ast)).toBe(
        'abstract:"buzz" OR abstract:"world"',
      );
    });
  });

  it("handles a complete example", () => {
    const ast: Module.AST = [
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
        fieldType: "number",
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
            value: "NOT",
          },
          {
            nodeType: "node",
            fieldType: "text",
            field: "subject.value",
            value: "mythology",
            comparator: "equals",
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
                field: "abstract",
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

    const queryString =
      'corpusName.raw:"elsevier" AND publicationDate:[2010 TO 2020] OR (abstract:"rings of Saturn" OR subject.value.raw:"Astrophysics" NOT subject.value.raw:"mythology" AND (hasFormula:true AND abstract:"helium")) AND qualityIndicators.tdmReady:true';

    expect(Module.astToString(ast)).toBe(queryString);
  });
});

describe("astContainsPartialNode", () => {
  it("returns true when an AST contains a partial node", () => {
    const ast: Module.AST = [
      {
        nodeType: "group",
        nodes: [
          {
            nodeType: "node",
            fieldType: "text",
            field: "abstract",
            value: "foo",
            comparator: "contains",
          },
          {
            nodeType: "operator",
            value: "OR",
          },
          {
            nodeType: "node",
            fieldType: "text",
            field: "abstract",
            value: "bar",
            comparator: "contains",
          },
        ],
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
            fieldType: "text",
            field: "abstract",
            value: "buzz",
            comparator: "contains",
          },
          {
            nodeType: "operator",
            value: "OR",
          },
          {
            nodeType: "node",
            fieldType: "text",
            field: "abstract",
            value: "world",
            comparator: "contains",
            partial: true,
          },
        ],
      },
    ];

    expect(Module.astContainsPartialNode(ast)).toBe(true);
  });

  it("returns false when given a complete AST", () => {
    const ast: Module.AST = [
      {
        nodeType: "group",
        nodes: [
          {
            nodeType: "node",
            fieldType: "text",
            field: "abstract",
            value: "foo",
            comparator: "contains",
          },
          {
            nodeType: "operator",
            value: "OR",
          },
          {
            nodeType: "node",
            fieldType: "text",
            field: "abstract",
            value: "bar",
            comparator: "contains",
          },
        ],
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
            fieldType: "text",
            field: "abstract",
            value: "buzz",
            comparator: "contains",
          },
          {
            nodeType: "operator",
            value: "OR",
          },
          {
            nodeType: "node",
            fieldType: "text",
            field: "abstract",
            value: "world",
            comparator: "contains",
          },
        ],
      },
    ];

    expect(Module.astContainsPartialNode(ast)).toBe(false);
  });
});

describe("astContainsField", () => {
  it("returns true when an AST contains a given field", () => {
    const ast: Module.AST = [
      {
        nodeType: "group",
        nodes: [
          {
            nodeType: "node",
            fieldType: "text",
            field: "corpusName",
            value: "foo",
            comparator: "contains",
          },
          {
            nodeType: "operator",
            value: "OR",
          },
          {
            nodeType: "node",
            fieldType: "text",
            field: "corpusName",
            value: "bar",
            comparator: "contains",
          },
        ],
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
            fieldType: "text",
            field: "language",
            value: "hello",
            comparator: "contains",
          },
          {
            nodeType: "operator",
            value: "OR",
          },
          {
            nodeType: "node",
            fieldType: "text",
            field: "language",
            value: "world",
            comparator: "contains",
          },
        ],
      },
    ];

    const field: Field = {
      name: "language",
      type: "text",
    };

    expect(Module.astContainsField(ast, field)).toBe(true);
  });

  it("returns false when an AST doesn't contain a given field", () => {
    const ast: Module.AST = [
      {
        nodeType: "group",
        nodes: [
          {
            nodeType: "node",
            fieldType: "text",
            field: "corpusName",
            value: "foo",
            comparator: "contains",
          },
          {
            nodeType: "operator",
            value: "OR",
          },
          {
            nodeType: "node",
            fieldType: "text",
            field: "corpusName",
            value: "bar",
            comparator: "contains",
          },
        ],
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
            fieldType: "text",
            field: "language",
            value: "hello",
            comparator: "contains",
          },
          {
            nodeType: "operator",
            value: "OR",
          },
          {
            nodeType: "node",
            fieldType: "text",
            field: "language",
            value: "world",
            comparator: "contains",
          },
        ],
      },
    ];

    const field: Field = {
      name: "publicationDate",
      type: "text",
    };

    expect(Module.astContainsField(ast, field)).toBe(false);
  });
});
