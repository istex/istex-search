import {
  emptyRule,
  addRule,
  addGroup,
  setField,
  setComparator,
  setValue,
  setRangeValue,
  setGroup,
  setOperator,
  removeNode,
  reset,
  getHeight,
  ruleHeight,
  buttonsHeight,
  spacing,
} from "@/app/[locale]/components/SearchSection/AssistedSearch/utils";
import type { AST, BooleanNode, NumberNode, TextNode } from "@/lib/queryAst";

describe("addRule", () => {
  it("should add a rule", () => {
    let ast: AST = [{ ...emptyRule }];
    const setAst = (newAst: AST) => {
      ast = newAst;
    };
    addRule(setAst, ast);
    expect(ast).toStrictEqual([
      { ...emptyRule },
      { nodeType: "operator", value: "AND" },
      { ...emptyRule },
    ]);
  });
});
describe("addGroup", () => {
  it("should add a group", () => {
    let ast: AST = [{ ...emptyRule }];
    const setAst = (newAst: AST) => {
      ast = newAst;
    };
    addGroup(setAst, ast);
    expect(ast).toStrictEqual([
      { ...emptyRule },
      { nodeType: "operator", value: "AND" },
      { nodeType: "group", nodes: [{ ...emptyRule }] },
    ]);
  });
});
describe("setField", () => {
  it("should set the field", () => {
    let ast: AST = [{ ...emptyRule }];
    const setAst = (newAst: AST) => {
      ast = newAst;
    };
    setField(setAst, ast, 0, "corpusName");
    expect(ast).toStrictEqual([{ ...emptyRule, field: "corpusName" }]);
  });
  it("should set the field to fulltext and set fieldType to text", () => {
    let ast: AST = [
      {
        nodeType: "node",
        fieldType: "boolean",
        field: "",
        value: null,
        comparator: "",
      },
    ];
    const setAst = (newAst: AST) => {
      ast = newAst;
    };
    setField(setAst, ast, 0, "fulltext");
    expect(ast).toStrictEqual([
      { ...emptyRule, field: "fulltext", fieldType: "text" },
    ]);
  });
  it("should set the field to hasFormula and set fieldType to boolean", () => {
    let ast: AST = [{ ...emptyRule }];
    const setAst = (newAst: AST) => {
      ast = newAst;
    };
    setField(setAst, ast, 0, "hasFormula");
    expect(ast).toStrictEqual([
      { ...emptyRule, field: "hasFormula", fieldType: "boolean", value: null },
    ]);
  });
  it("should set the field to publicationDate and set fieldType to number", () => {
    let ast: AST = [{ ...emptyRule }];
    const setAst = (newAst: AST) => {
      ast = newAst;
    };
    setField(setAst, ast, 0, "publicationDate");
    expect(ast).toStrictEqual([
      {
        ...emptyRule,
        field: "publicationDate",
        fieldType: "number",
        value: null,
      },
    ]);
  });
  it("should set the field to publicationDate and keep fieldType to range", () => {
    let ast: AST = [
      {
        nodeType: "node",
        fieldType: "range",
        field: "",
        min: null,
        max: null,
        comparator: "between",
      },
    ];
    const setAst = (newAst: AST) => {
      ast = newAst;
    };
    setField(setAst, ast, 0, "publicationDate");
    expect(ast).toStrictEqual([
      {
        nodeType: "node",
        field: "publicationDate",
        fieldType: "range",
        min: null,
        max: null,
        comparator: "between",
      },
    ]);
  });
});
describe("setComparator", () => {
  it("should set the comparator", () => {
    let ast: AST = [{ ...emptyRule }];
    const setAst = (newAst: AST) => {
      ast = newAst;
    };
    setComparator(setAst, ast, 0, "equals");
    expect(ast).toStrictEqual([{ ...emptyRule, comparator: "equals" }]);
  });
  it("should set the comparator to between and set fieldType to range", () => {
    let ast: AST = [{ ...emptyRule }];
    const setAst = (newAst: AST) => {
      ast = newAst;
    };
    setComparator(setAst, ast, 0, "between");
    expect(ast).toStrictEqual([
      {
        nodeType: "node",
        field: "",
        comparator: "between",
        fieldType: "range",
        min: null,
        max: null,
      },
    ]);
  });
  it("should set the comparator to equals and keep fieldType to boolean", () => {
    const booleanRule: BooleanNode = {
      nodeType: "node",
      fieldType: "boolean",
      field: "hasFormula",
      value: null,
      comparator: "",
    };
    let ast: AST = [{ ...booleanRule }];
    const setAst = (newAst: AST) => {
      ast = newAst;
    };
    setComparator(setAst, ast, 0, "equals");
    expect(ast).toStrictEqual([{ ...booleanRule, comparator: "equals" }]);
  });
  it("should set the comparator and keep fieldType to number", () => {
    const booleanRule: NumberNode = {
      nodeType: "node",
      fieldType: "number",
      field: "publicationDate",
      value: null,
      comparator: "",
    };
    let ast: AST = [{ ...booleanRule }];
    const setAst = (newAst: AST) => {
      ast = newAst;
    };
    setComparator(setAst, ast, 0, "equals");
    expect(ast).toStrictEqual([{ ...booleanRule, comparator: "equals" }]);
  });
  it("should set the comparator to notEquals and keep fieldType to text", () => {
    let ast: AST = [{ ...emptyRule }];
    const setAst = (newAst: AST) => {
      ast = newAst;
    };
    setComparator(setAst, ast, 0, "notEquals");
    expect(ast).toStrictEqual([{ ...emptyRule, comparator: "notEquals" }]);
  });
});
describe("setValue", () => {
  it("should set the value", () => {
    let ast: AST = [{ ...emptyRule }];
    const setAst = (newAst: AST) => {
      ast = newAst;
    };
    setValue(setAst, ast, 0, "test");
    expect(ast).toStrictEqual([{ ...emptyRule, value: "test" }]);
  });
});
describe("setRangeValue", () => {
  it("should set the min and the max value", () => {
    let ast: AST = [
      {
        nodeType: "node",
        fieldType: "range",
        field: "",
        min: null,
        max: null,
        comparator: "between",
      },
    ];
    const setAst = (newAst: AST) => {
      ast = newAst;
    };
    setRangeValue(setAst, ast, 0, 1, 2);
    expect(ast).toStrictEqual([
      {
        nodeType: "node",
        field: "",
        comparator: "between",
        fieldType: "range",
        min: 1,
        max: 2,
      },
    ]);
  });
  it("should only set the min value", () => {
    let ast: AST = [
      {
        nodeType: "node",
        fieldType: "range",
        field: "",
        min: null,
        max: null,
        comparator: "between",
      },
    ];
    const setAst = (newAst: AST) => {
      ast = newAst;
    };
    setRangeValue(setAst, ast, 0, 1);
    expect(ast).toStrictEqual([
      {
        nodeType: "node",
        field: "",
        comparator: "between",
        fieldType: "range",
        min: 1,
        max: null,
      },
    ]);
  });
  it("should only set the max value", () => {
    let ast: AST = [
      {
        nodeType: "node",
        fieldType: "range",
        field: "",
        min: null,
        max: null,
        comparator: "between",
      },
    ];
    const setAst = (newAst: AST) => {
      ast = newAst;
    };
    setRangeValue(setAst, ast, 0, undefined, 2);
    expect(ast).toStrictEqual([
      {
        nodeType: "node",
        field: "",
        comparator: "between",
        fieldType: "range",
        min: null,
        max: 2,
      },
    ]);
  });
  it("should do nothing", () => {
    let ast: AST = [
      {
        nodeType: "node",
        fieldType: "range",
        field: "",
        min: null,
        max: null,
        comparator: "between",
      },
    ];
    const setAst = (newAst: AST) => {
      ast = newAst;
    };
    setRangeValue(setAst, ast, 0);
    expect(ast).toStrictEqual([
      {
        nodeType: "node",
        field: "",
        comparator: "between",
        fieldType: "range",
        min: null,
        max: null,
      },
    ]);
  });
});
describe("setGroup", () => {
  it("should set the group", () => {
    let ast: AST = [{ nodeType: "group", nodes: [] }];
    const setAst = (newAst: AST) => {
      ast = newAst;
    };
    setGroup(setAst, ast, 0, [{ ...emptyRule }]);
    expect(ast).toStrictEqual([
      { nodeType: "group", nodes: [{ ...emptyRule }] },
    ]);
  });
});
describe("setOperator", () => {
  it("should set the operator", () => {
    let ast: AST = [{ nodeType: "operator", value: "OR" }];
    const setAst = (newAst: AST) => {
      ast = newAst;
    };
    setOperator(setAst, ast, 0, "AND");
    expect(ast).toStrictEqual([{ nodeType: "operator", value: "AND" }]);
  });
});
describe("removeNode", () => {
  const rule1: TextNode = {
    nodeType: "node",
    fieldType: "text",
    field: "",
    value: "rule1",
    comparator: "",
  };
  const rule2: TextNode = {
    nodeType: "node",
    fieldType: "text",
    field: "",
    value: "rule2",
    comparator: "",
  };
  it("should remove the node with the precedent operator", () => {
    let ast: AST = [
      rule1,
      { nodeType: "operator", value: "AND" },
      rule1,
      { nodeType: "operator", value: "OR" },
      rule2,
    ];
    const setAst = (newAst: AST) => {
      ast = newAst;
    };
    removeNode(setAst, ast, 4);
    expect(ast).toStrictEqual([
      rule1,
      { nodeType: "operator", value: "AND" },
      rule1,
    ]);
  });
  it("should remove the node with the next operator", () => {
    let ast: AST = [
      { ...emptyRule },
      { nodeType: "operator", value: "AND" },
      rule1,
      { nodeType: "operator", value: "OR" },
      rule2,
    ];
    const setAst = (newAst: AST) => {
      ast = newAst;
    };
    removeNode(setAst, ast, 0);
    expect(ast).toStrictEqual([
      rule1,
      { nodeType: "operator", value: "OR" },
      rule2,
    ]);
  });
});
describe("reset", () => {
  it("should reset the ast", () => {
    let ast: AST = [
      { ...emptyRule },
      { nodeType: "operator", value: "AND" },
      { ...emptyRule },
    ];
    const setAst = (newAst: AST) => {
      ast = newAst;
    };
    reset(setAst);
    expect(ast).toStrictEqual([{ ...emptyRule }]);
  });
});
describe("getHeight", () => {
  it("should return the height of the rule", () => {
    expect(getHeight({ ...emptyRule })).toBe(ruleHeight);
  });
  it("should return the height of the group", () => {
    expect(getHeight({ nodeType: "group", nodes: [] })).toBe(buttonsHeight);
  });
  it("should return the height of the operator", () => {
    expect(getHeight({ nodeType: "operator", value: "AND" })).toBe(0);
  });
  it("should return the height of a group with many rules", () => {
    expect(
      getHeight({
        nodeType: "group",
        nodes: [
          { ...emptyRule },
          { nodeType: "operator", value: "AND" },
          { ...emptyRule },
        ],
      }),
    ).toBe(buttonsHeight + 2 * ruleHeight + 3 * spacing);
  });
});
