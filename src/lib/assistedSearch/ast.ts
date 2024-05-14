/* eslint-disable no-use-before-define */
import { type fields } from "./fields";

export const nodeTypes = ["node", "operator", "group"] as const;
export type NodeType = (typeof nodeTypes)[number];

export const operators = ["AND", "OR", "NOT"] as const;
export const DEFAULT_OPERATOR = operators[0];
export type Operator = (typeof operators)[number];

export const fieldTypes = ["text", "number", "boolean"] as const;
export type FieldType = (typeof fieldTypes)[number];

export const baseComparators = ["equals"] as const;
export type BaseComparator = (typeof baseComparators)[number];

export const textComparators = [
  ...baseComparators,
  "contains",
  "startsWith",
  "endsWith",
] as const;
export type TextComparator = (typeof textComparators)[number];

export const rangeComparators = ["between"] as const;
export const numberComparators = [
  ...baseComparators,
  ...rangeComparators,
  "smaller",
  "greater",
] as const;
export type NumberComparator = (typeof numberComparators)[number];
export type RangeComparator = (typeof rangeComparators)[number];

export const booleanComparators = baseComparators;
export type BooleanComparator = BaseComparator;

export type Comparator = TextComparator | NumberComparator | BooleanComparator;

export interface BaseNode {
  id?: number;
  nodeType: NodeType;
}

export type FieldName = (typeof fields)[number]["name"];

export interface BaseFieldNode extends BaseNode {
  nodeType: "node";
  partial?: boolean;
  fieldType: FieldType;
  field: FieldName;
  implicitNodes?: AST;
  comparator: Comparator;
}

export interface OperatorNode extends BaseNode {
  nodeType: "operator";
  value: Operator;
}

export interface GroupNode extends BaseNode {
  nodeType: "group";
  root?: boolean;
  nodes: Node[];
}

export interface TextNode extends BaseFieldNode {
  fieldType: "text";
  value: string;
  comparator: TextComparator;
}

export type NumberNode = BaseFieldNode & {
  fieldType: "number";
} & (
    | {
        value: number;
        comparator: Exclude<NumberComparator, RangeComparator>;
      }
    | {
        min: number;
        max: number;
        comparator: RangeComparator;
      }
  );

export interface BooleanNode extends BaseFieldNode {
  fieldType: "boolean";
  value: boolean;
  comparator: BooleanComparator;
}

export type FieldNode = TextNode | NumberNode | BooleanNode;

export type Node = FieldNode | OperatorNode | GroupNode;

export type AST = Node[];

export function astToString(ast: AST): string {
  let result = "";

  for (let i = 0; i < ast.length; i++) {
    const node = ast[i];
    const previousNode = i > 0 ? ast[i - 1] : null;
    const nextNode = i < ast.length - 1 ? ast[i + 1] : null;
    const hasPartialSiblings =
      (previousNode?.nodeType === "node" && previousNode.partial === true) ||
      (nextNode?.nodeType === "node" && nextNode.partial === true);

    if (node.nodeType === "node") {
      result += fieldNodeToString(node);
    } else if (node.nodeType === "operator") {
      result += operatorNodeToString(node, hasPartialSiblings);
    } else {
      result += groupNodeToString(node);
    }
  }

  return result;
}

function fieldNodeToString(node: BaseFieldNode): string {
  if (node.partial === true) {
    return "";
  }

  let result;

  if (node.fieldType === "text") {
    result = textNodeToString(node as TextNode);
  } else if (node.fieldType === "number") {
    result = numberNodeToString(node as NumberNode);
  }
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  else if (node.fieldType === "boolean") {
    result = booleanNodeToString(node as BooleanNode);
  } else {
    throw new Error(
      `Unexpected field type received. Expected one of ${fieldTypes.toString()} but received "${
        node.fieldType as string
      }"`,
    );
  }

  // Some nodes have implicit nodes, which means the query to generate isn't simply "<field>:<value>" but
  // "(<field>:<value> AND <implicitField1>:<implicitValue1> <operator> <implicitField2>:<implicitValue2> ...)"
  if (node.implicitNodes != null) {
    const implicitQueryFragment = astToString(node.implicitNodes);

    return `(${result} AND ${implicitQueryFragment})`;
  }

  return result;
}

function operatorNodeToString(
  node: OperatorNode,
  hasPartialSiblings: boolean,
): string {
  // Skip the operator if at least one sibling node is partial
  if (hasPartialSiblings) {
    return "";
  }

  return ` ${node.value} `;
}

function groupNodeToString(node: GroupNode): string {
  // If the group is the root node in the AST, don't surround
  // with parentheses
  if (node.root === true) {
    return astToString(node.nodes);
  }

  return `(${astToString(node.nodes)})`;
}

function textNodeToString(node: TextNode): string {
  let result = "";

  const fieldName = getFieldName(node);
  const rawVersionRequired =
    (node.comparator === "equals" ||
      node.comparator === "startsWith" ||
      node.comparator === "endsWith") &&
    fieldName !== "fulltext";

  if (rawVersionRequired) {
    result += `${fieldName}.raw:`;
  } else {
    result += `${fieldName}:`;
  }

  // Check if a wildcard is required
  if (node.comparator === "startsWith") {
    result += `${node.value}*`;
  } else if (node.comparator === "endsWith") {
    result += `*${node.value}`;
  } else {
    result += `"${node.value}"`;
  }

  return result;
}

function numberNodeToString(node: NumberNode): string {
  let result = `${getFieldName(node)}:`;

  const hasValue = "value" in node;
  const hasRange = "min" in node && "max" in node;

  if (hasValue) {
    // Check if an inequality symbol is required
    if (node.comparator === "smaller") {
      result += `<${node.value}`;
    } else if (node.comparator === "greater") {
      result += `>${node.value}`;
    } else {
      result += node.value.toString();
    }
  } else if (hasRange) {
    result += `[${node.min} TO ${node.max}]`;
  }

  return result;
}

function booleanNodeToString(node: BooleanNode): string {
  return `${getFieldName(node)}:${node.value}`;
}

export function getFieldName(node: BaseFieldNode): FieldName {
  // Some field names contain an "@" symbol because different versions of them
  // are available in the assisted search, but when building the Lucene query,
  // we only want to keep the base field name. For example, both "fulltext" and
  // fulltext@1" map to the "fulltext" field in the API, "fulltext@1" just means
  // implicit rules need to be created.
  return node.field.split("@")[0] as FieldName;
}

// We use functions that returns new objects on every call instead of
// a constant because nodes can be mutated in place and we don't want to
// accidentally mutate global constants

export function getEmptyFieldNode(): TextNode {
  return {
    id: Math.random(),
    nodeType: "node",
    partial: true,
    fieldType: "text",
    field: "abstract",
    value: "hello",
    comparator: "contains",
  };
}

export function getEmptyGroupNode(root?: boolean): GroupNode {
  return {
    id: Math.random(),
    nodeType: "group",
    root,
    nodes: [getEmptyFieldNode()],
  };
}

export function getDefaultOperatorNode(): OperatorNode {
  return {
    id: Math.random(),
    nodeType: "operator",
    value: DEFAULT_OPERATOR,
  };
}

export function getEmptyAst(): AST {
  return [getEmptyGroupNode(true)];
}

export function astContainsPartialNode(ast: AST): boolean {
  for (const node of ast) {
    if (node.nodeType === "node" && node.partial === true) {
      return true;
    }

    if (node.nodeType === "group") {
      return astContainsPartialNode(node.nodes);
    }
  }

  return false;
}
