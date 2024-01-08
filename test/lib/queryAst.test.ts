import * as Module from "@/lib/queryAst";

describe("Converting the query AST into a Lucene query", () => {
  describe("text nodes", () => {
    it("handles the contains comparator", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "text",
          field: "foo",
          value: "bar",
          comparator: "contains",
        },
      ];

      expect(Module.astToString(ast)).toBe('foo:"bar"');
    });

    it("handles the notContains operator", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "text",
          field: "foo",
          value: "bar",
          comparator: "notContains",
        },
      ];

      expect(Module.astToString(ast)).toBe('(NOT foo:"bar")');
    });

    it("handles the equals comparator", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "text",
          field: "foo",
          value: "bar",
          comparator: "equals",
        },
      ];

      expect(Module.astToString(ast)).toBe('foo.raw:"bar"');
    });

    it("handles the notEquals comparator", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "text",
          field: "foo",
          value: "bar",
          comparator: "notEquals",
        },
      ];

      expect(Module.astToString(ast)).toBe('(NOT foo.raw:"bar")');
    });

    it("handles the startsWith comparator", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "text",
          field: "foo",
          value: "bar",
          comparator: "startsWith",
        },
      ];

      expect(Module.astToString(ast)).toBe("foo:bar*");
    });

    it("handles the notStartsWith comparator", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "text",
          field: "foo",
          value: "bar",
          comparator: "notStartsWith",
        },
      ];

      expect(Module.astToString(ast)).toBe("(NOT foo:bar*)");
    });

    it("handles the endsWith comparator", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "text",
          field: "foo",
          value: "bar",
          comparator: "endsWith",
        },
      ];

      expect(Module.astToString(ast)).toBe("foo:*bar");
    });

    it("handles the notEndsWith comparator", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "text",
          field: "foo",
          value: "bar",
          comparator: "notEndsWith",
        },
      ];

      expect(Module.astToString(ast)).toBe("(NOT foo:*bar)");
    });
  });

  describe("number nodes", () => {
    it("handles the equals comparator", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "number",
          field: "score",
          value: 3,
          comparator: "equals",
        },
      ];

      expect(Module.astToString(ast)).toBe("score:3");
    });

    it("handles the notEquals comparator", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "number",
          field: "score",
          value: 3,
          comparator: "notEquals",
        },
      ];

      expect(Module.astToString(ast)).toBe("(NOT score:3)");
    });

    it("handles the smaller comparator", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "number",
          field: "score",
          value: 3,
          comparator: "smaller",
        },
      ];

      expect(Module.astToString(ast)).toBe("score:<3");
    });

    it("handles the greater comparator", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "number",
          field: "score",
          value: 3,
          comparator: "greater",
        },
      ];

      expect(Module.astToString(ast)).toBe("score:>3");
    });
  });

  describe("range nodes", () => {
    it("handles the between comparator", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "range",
          field: "score",
          min: 3,
          max: 5,
          comparator: "between",
        },
      ];

      expect(Module.astToString(ast)).toBe("score:[3 TO 5]");
    });

    it("handles the notBetween comparator", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "range",
          field: "score",
          min: 3,
          max: 5,
          comparator: "notBetween",
        },
      ];

      expect(Module.astToString(ast)).toBe("(NOT score:[3 TO 5])");
    });
  });

  describe("boolean nodes", () => {
    it("handles the equals comparator", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "boolean",
          field: "good",
          value: false,
          comparator: "equals",
        },
      ];

      expect(Module.astToString(ast)).toBe("good:false");
    });

    it("handles the notEquals comparator", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "boolean",
          field: "good",
          value: true,
          comparator: "notEquals",
        },
      ];

      expect(Module.astToString(ast)).toBe("(NOT good:true)");
    });
  });

  describe("operator nodes", () => {
    it("handles joining text nodes with operator OR", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "text",
          field: "foo",
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
          field: "fizz",
          value: "buzz",
          comparator: "contains",
        },
      ];

      expect(Module.astToString(ast)).toBe('foo:"bar" OR fizz:"buzz"');
    });

    it("handles joining text nodes with operator AND", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "text",
          field: "foo",
          value: "bar",
          comparator: "notContains",
        },
        {
          nodeType: "operator",
          value: "AND",
        },
        {
          nodeType: "node",
          fieldType: "text",
          field: "fizz",
          value: "buzz",
          comparator: "contains",
        },
      ];

      expect(Module.astToString(ast)).toBe('(NOT foo:"bar") AND fizz:"buzz"');
    });
  });

  describe("group nodes", () => {
    it("handles group nodes", () => {
      const ast: Module.AST = [
        {
          nodeType: "node",
          fieldType: "text",
          field: "foo",
          value: "bar",
          comparator: "notContains",
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
              field: "fizz",
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
              field: "hello",
              value: "world",
              comparator: "contains",
            },
          ],
        },
      ];

      expect(Module.astToString(ast)).toBe(
        '(NOT foo:"bar") AND (fizz:"buzz" OR hello:"world")',
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

    const queryString =
      'corpusName.raw:"elsevier" AND publicationDate:[2010 TO 2020] OR (abstract:"rings of Saturn" OR subject.value.raw:"Astrophysics" AND (NOT subject.value.raw:"mythology") AND (hasFormula:true AND fulltext:"helium")) AND qualityIndicators.tdmReady:true';

    expect(Module.astToString(ast)).toBe(queryString);
  });
});
