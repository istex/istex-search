import type {
  AST,
  Node,
  OperatorNode,
  Operator,
  GroupNode,
  TextNode,
  NumberNode,
  RangeNode,
  BooleanNode,
  Comparator,
} from "@/lib/queryAst";

const transformNode = (
  node: TextNode | NumberNode | RangeNode | BooleanNode,
): TextNode | NumberNode | RangeNode | BooleanNode => {
  switch (node.fieldType) {
    case "boolean":
      if (
        "value" in node &&
        ((node as unknown as TextNode).value === "true" ||
          (node as unknown as TextNode).value === "false")
      ) {
        node.value = Boolean((node as unknown as TextNode).value);
      } else {
        node.value = null;
      }
      if ("min" in node && "max" in node) {
        delete node.min;
        delete node.max;
      }
      return node;
    case "range":
      if ("value" in node) delete node.value;
      node.min = null;
      node.max = null;
      return node;
    case "number":
      if (
        "value" in node &&
        node.value !== null &&
        !isNaN(+node.value) &&
        (node as unknown as TextNode).value !== ""
      ) {
        node.value = +node.value;
      } else if (
        "value" in node &&
        (node as unknown as TextNode).value === "*"
      ) {
        node.value = "*";
      } else {
        node.value = null;
      }
      if ("min" in node && "max" in node) {
        delete node.min;
        delete node.max;
      }
      return node;
    default: // case "text"
      if ("value" in node && node.value !== null) {
        node.value = node.value.toString();
      } else {
        (node as TextNode).value = "";
      }
      if ("min" in node && "max" in node) {
        delete node.min;
        delete node.max;
      }
      return node;
  }
};

export const emptyRule: Node = {
  nodeType: "node",
  fieldType: "text",
  field: "",
  value: "",
  comparator: "",
};

export const addRule = (setFunction: (array: AST) => void, array: AST) => {
  setFunction([
    ...array,
    { nodeType: "operator", value: "AND" },
    { ...emptyRule },
  ]);
};

export const addGroup = (setFunction: (array: AST) => void, array: AST) => {
  setFunction([
    ...array,
    { nodeType: "operator", value: "AND" },
    { nodeType: "group", nodes: [{ ...emptyRule }] },
  ]);
};

export function setField(
  setFunction: (array: AST) => void,
  array: AST,
  index: number,
  newField: string,
) {
  const newParsedAst = [...array];
  const changeFieldType =
    newField !==
    (newParsedAst[index] as TextNode | NumberNode | RangeNode | BooleanNode)
      .fieldType;
  (
    newParsedAst[index] as TextNode | NumberNode | RangeNode | BooleanNode
  ).field = newField;

  if (newField === "hasFormula" || newField === "qualityIndicators.tdmReady") {
    (
      newParsedAst[index] as TextNode | NumberNode | RangeNode | BooleanNode
    ).fieldType = "boolean";
  } else if (
    "comparator" in newParsedAst[index] &&
    (newParsedAst[index] as RangeNode).comparator === "between"
  ) {
    (newParsedAst[index] as RangeNode).fieldType = "range";
  } else if (newField === "publicationDate") {
    (
      newParsedAst[index] as TextNode | NumberNode | RangeNode | BooleanNode
    ).fieldType = "number";
  } else {
    (
      newParsedAst[index] as TextNode | NumberNode | RangeNode | BooleanNode
    ).fieldType = "text";
  }
  if (changeFieldType)
    newParsedAst[index] = transformNode(
      newParsedAst[index] as TextNode | NumberNode | RangeNode | BooleanNode,
    );

  setFunction(newParsedAst);
}

export function setComparator(
  setFunction: (array: AST) => void,
  array: AST,
  index: number,
  newComparator: Comparator,
) {
  const newParsedAst = [...array];
  const oldFieldType = (
    newParsedAst[index] as TextNode | NumberNode | RangeNode | BooleanNode
  ).fieldType;
  (
    newParsedAst[index] as TextNode | NumberNode | RangeNode | BooleanNode
  ).comparator = newComparator;

  if (newComparator === "between" || newComparator === "notBetween") {
    (newParsedAst[index] as RangeNode).fieldType = "range";
  } else if (
    "field" in newParsedAst[index] &&
    ((newParsedAst[index] as BooleanNode).field === "hasFormula" ||
      (newParsedAst[index] as BooleanNode).field ===
        "qualityIndicators.tdmReady")
  ) {
    (newParsedAst[index] as BooleanNode).fieldType = "boolean";
  } else if (
    "field" in newParsedAst[index] &&
    (newParsedAst[index] as NumberNode).field === "publicationDate"
  ) {
    (newParsedAst[index] as NumberNode).fieldType = "number";
  } else {
    (newParsedAst[index] as TextNode).fieldType = "text";
  }

  if (
    oldFieldType !==
    (newParsedAst[index] as TextNode | NumberNode | RangeNode | BooleanNode)
      .fieldType
  )
    newParsedAst[index] = transformNode(
      newParsedAst[index] as TextNode | NumberNode | RangeNode | BooleanNode,
    );

  setFunction(newParsedAst);
}

export function setValue(
  setFunction: (array: AST) => void,
  array: AST,
  index: number,
  newValue: string | number | boolean | null,
) {
  const newParsedAst = [...array];
  (newParsedAst[index] as TextNode | NumberNode | BooleanNode).value = newValue;
  setFunction(newParsedAst);
}

export function setRangeValue(
  setFunction: (array: AST) => void,
  array: AST,
  index: number,
  min?: number | null | "*",
  max?: number | null | "*",
) {
  const newParsedAst = [...array];
  if (min !== undefined) (newParsedAst[index] as RangeNode).min = min;
  if (max !== undefined) (newParsedAst[index] as RangeNode).max = max;
  setFunction(newParsedAst);
}

export function setGroup(
  setFunction: (array: AST) => void,
  array: AST,
  index: number,
  newGroup: Node[],
) {
  const newParsedAst = [...array];
  (newParsedAst[index] as GroupNode).nodes = newGroup;
  setFunction(newParsedAst);
}

export function setOperator(
  setFunction: (array: AST) => void,
  array: AST,
  index: number,
  newOperator: Operator,
) {
  const newParsedAst = [...array];
  (newParsedAst[index] as OperatorNode).value = newOperator;
  setFunction(newParsedAst);
}

export const removeNode = (
  setFunction: (array: AST) => void,
  array: AST,
  index: number,
) => {
  if (array.length === 1) {
    reset(setFunction);
  } else {
    const newParsedAst = [...array];
    if (index === 0) newParsedAst.splice(0, 2);
    else newParsedAst.splice(index - 1, 2);
    setFunction(newParsedAst);
  }
};

export const reset = (setFunction: (array: AST) => void) => {
  setFunction([{ ...emptyRule }]);
};
