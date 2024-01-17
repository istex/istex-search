import { fieldsDefinition } from "./fieldsList";
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
  FieldType,
} from "@/lib/queryAst";

const transformNode = (
  node: TextNode | NumberNode | RangeNode | BooleanNode,
  resetComparator = false,
): TextNode | NumberNode | RangeNode | BooleanNode => {
  if (
    resetComparator &&
    node.comparator !== "equals" &&
    node.comparator !== "notEquals"
  )
    node.comparator = "";
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

export const addRule = (setAst: (ast: AST) => void, ast: AST) => {
  setAst([...ast, { nodeType: "operator", value: "AND" }, { ...emptyRule }]);
};

export const addGroup = (setAst: (ast: AST) => void, ast: AST) => {
  setAst([
    ...ast,
    { nodeType: "operator", value: "AND" },
    { nodeType: "group", nodes: [{ ...emptyRule }] },
  ]);
};

export function setField(
  setAst: (ast: AST) => void,
  ast: AST,
  index: number,
  newField: string,
) {
  const newParsedAst = [...ast];
  const oldFieldType = (
    newParsedAst[index] as TextNode | NumberNode | RangeNode | BooleanNode
  ).fieldType;
  (
    newParsedAst[index] as TextNode | NumberNode | RangeNode | BooleanNode
  ).field = newField;
  const newFieldType = fieldsDefinition.find(
    (field) => field.field === newField,
  )?.type as FieldType;

  if (
    !(
      oldFieldType === "range" &&
      ((newParsedAst[index] as TextNode | NumberNode | RangeNode | BooleanNode)
        .comparator === "between" ||
        (newParsedAst[index] as TextNode | NumberNode | RangeNode | BooleanNode)
          .comparator === "notBetween")
    )
  )
    (
      newParsedAst[index] as TextNode | NumberNode | RangeNode | BooleanNode
    ).fieldType = newFieldType;

  if (
    oldFieldType !==
    (newParsedAst[index] as TextNode | NumberNode | RangeNode | BooleanNode)
      .fieldType
  )
    newParsedAst[index] = transformNode(
      newParsedAst[index] as TextNode | NumberNode | RangeNode | BooleanNode,
      true,
    );

  setAst(newParsedAst);
}

export function setComparator(
  setAst: (ast: AST) => void,
  ast: AST,
  index: number,
  newComparator: Comparator,
) {
  const newParsedAst = [...ast];
  const oldFieldType = (
    newParsedAst[index] as TextNode | NumberNode | RangeNode | BooleanNode
  ).fieldType;
  (
    newParsedAst[index] as TextNode | NumberNode | RangeNode | BooleanNode
  ).comparator = newComparator;

  if (newComparator === "between" || newComparator === "notBetween") {
    (
      newParsedAst[index] as TextNode | NumberNode | RangeNode | BooleanNode
    ).fieldType = "range";
  } else if (
    (newParsedAst[index] as TextNode | NumberNode | RangeNode | BooleanNode)
      .fieldType === "range"
  ) {
    (
      newParsedAst[index] as TextNode | NumberNode | RangeNode | BooleanNode
    ).fieldType = "number";
  }

  if (
    oldFieldType !==
    (newParsedAst[index] as TextNode | NumberNode | RangeNode | BooleanNode)
      .fieldType
  )
    newParsedAst[index] = transformNode(
      newParsedAst[index] as TextNode | NumberNode | RangeNode | BooleanNode,
    );

  setAst(newParsedAst);
}

export function setValue(
  setAst: (ast: AST) => void,
  ast: AST,
  index: number,
  newValue: string | number | boolean | null,
) {
  const newParsedAst = [...ast];
  (newParsedAst[index] as TextNode | NumberNode | BooleanNode).value = newValue;
  setAst(newParsedAst);
}

export function setRangeValue(
  setAst: (ast: AST) => void,
  ast: AST,
  index: number,
  min?: number | null | "*",
  max?: number | null | "*",
) {
  const newParsedAst = [...ast];
  if (min !== undefined) (newParsedAst[index] as RangeNode).min = min;
  if (max !== undefined) (newParsedAst[index] as RangeNode).max = max;
  setAst(newParsedAst);
}

export function setGroup(
  setAst: (ast: AST) => void,
  ast: AST,
  index: number,
  newGroup: Node[],
) {
  const newParsedAst = [...ast];
  (newParsedAst[index] as GroupNode).nodes = newGroup;
  setAst(newParsedAst);
}

export function setOperator(
  setAst: (ast: AST) => void,
  ast: AST,
  index: number,
  newOperator: Operator,
) {
  const newParsedAst = [...ast];
  (newParsedAst[index] as OperatorNode).value = newOperator;
  setAst(newParsedAst);
}

export const removeNode = (
  setAst: (ast: AST) => void,
  ast: AST,
  index: number,
) => {
  if (ast.length === 1) {
    reset(setAst);
  } else {
    const newParsedAst = [...ast];
    if (index === 0) newParsedAst.splice(0, 2);
    else newParsedAst.splice(index - 1, 2);
    setAst(newParsedAst);
  }
};

export const reset = (setAst: (ast: AST) => void) => {
  setAst([{ ...emptyRule }]);
};

export const spacing = 10;
export const ruleHeight = 52;
export const buttonsHeight = 36.5;
export const getHeight = (node: Node) => {
  let height = buttonsHeight;
  switch (node.nodeType) {
    case "group":
      node.nodes.forEach((node: Node) => {
        height += getHeight(node) + spacing;
      });
      height -= spacing;
      return height;
    case "node":
      return ruleHeight;
    default: // case "operator"
      return 0;
  }
};
