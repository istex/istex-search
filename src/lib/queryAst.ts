export const nodeTypes = ["node", "operator", "group"] as const;
export type NodeType = (typeof nodeTypes)[number];

export const operators = ["AND", "OR"] as const;
export type Operator = (typeof operators)[number];

export const fieldTypes = ["text", "number", "range", "boolean"] as const;
export type FieldType = (typeof fieldTypes)[number];

export const baseComparators = ["equals", "notEquals", ""] as const;
export type BaseComparator = (typeof baseComparators)[number];

export const textComparators = [
  ...baseComparators,
  "contains",
  "notContains",
  "startsWith",
  "notStartsWith",
  "endsWith",
  "notEndsWith",
] as const;
export type TextComparator = (typeof textComparators)[number];

export const numberComparators = [
  ...baseComparators,
  "smaller",
  "greater",
] as const;
export type NumberComparator = (typeof numberComparators)[number];

export const rangeComparators = ["between", "notBetween"] as const;
export type RangeComparator = (typeof rangeComparators)[number];

export const booleanComparators = baseComparators;
export type BooleanComparator = BaseComparator;

export type Comparator =
  | TextComparator
  | NumberComparator
  | RangeComparator
  | BooleanComparator;

export interface BaseNode {
  nodeType: NodeType;
}

export interface FieldNode extends BaseNode {
  nodeType: "node";
  fieldType: FieldType;
  field: string;
  comparator: Comparator;
}

export interface OperatorNode extends BaseNode {
  nodeType: "operator";
  value: Operator;
}

export interface GroupNode extends BaseNode {
  nodeType: "group";
  nodes: Node[];
}

export type Node =
  | TextNode
  | NumberNode
  | RangeNode
  | BooleanNode
  | OperatorNode
  | GroupNode;

export interface TextNode extends FieldNode {
  fieldType: "text";
  value: string;
  comparator: TextComparator;
}

export interface NumberNode extends FieldNode {
  fieldType: "number";
  value: number | null | "*";
  comparator: NumberComparator;
}

export interface RangeNode extends FieldNode {
  fieldType: "range";
  min: number | null | "*";
  max: number | null | "*";
  comparator: RangeComparator;
}

export interface BooleanNode extends FieldNode {
  fieldType: "boolean";
  value: boolean | null;
  comparator: BooleanComparator;
}

export type AST = Node[];

export function astToString(ast: AST): string {
  let result = "";

  for (const node of ast) {
    if (node.nodeType === "node") {
      result += fieldNodeToString(node);
    } else if (node.nodeType === "operator") {
      result += operatorNodeToString(node);
    } else if (node.nodeType === "group") {
      result += groupNodeToString(node);
    }
  }

  return result;
}

function fieldNodeToString(node: FieldNode): string {
  if (node.fieldType === "text") {
    return textNodeToString(node as TextNode);
  } else if (node.fieldType === "number") {
    return numberNodeToString(node as NumberNode);
  } else if (node.fieldType === "range") {
    return rangeNodeToString(node as RangeNode);
  } else if (node.fieldType === "boolean") {
    return booleanNodeToString(node as BooleanNode);
  }

  throw new Error(
    `Unexpected field type received. Expected one of ${fieldTypes.toString()} but received "${
      node.fieldType as string
    }"`,
  );
}

function operatorNodeToString(node: OperatorNode): string {
  return ` ${node.value} `;
}

function groupNodeToString(node: GroupNode): string {
  return `(${astToString(node.nodes)})`;
}

function textNodeToString(node: TextNode): string {
  let result = "";

  // Check if using the ".raw" variant of the field is required
  if (
    (node.comparator === "equals" || node.comparator === "notEquals") &&
    node.field !== "fulltext" &&
    node.field !== "qualityIndicators.tdmReady:true AND fulltext"
  ) {
    result += `${node.field}.raw:`;
  } else {
    result += `${node.field}:`;
  }

  // Check if a wildcard is required
  if (node.comparator === "startsWith" || node.comparator === "notStartsWith") {
    result += `${node.value}*`;
  } else if (
    node.comparator === "endsWith" ||
    node.comparator === "notEndsWith"
  ) {
    result += `*${node.value}`;
  } else {
    result += `"${node.value}"`;
  }

  result = addNotPrefixIfNeeded(result, node.comparator);

  return result;
}

function numberNodeToString(node: NumberNode): string {
  let result = `${node.field}:`;

  // Check if an inequality symbol is required
  if (node.comparator === "smaller") {
    result += `<${node.value ?? 0}`;
  } else if (node.comparator === "greater") {
    result += `>${node.value ?? 0}`;
  } else {
    result += node.value?.toString() ?? "0";
  }

  result = addNotPrefixIfNeeded(result, node.comparator);

  return result;
}

function rangeNodeToString(node: RangeNode): string {
  let result = `${node.field}:[${node.min ?? 0} TO ${node.max ?? 0}]`;

  result = addNotPrefixIfNeeded(result, node.comparator);

  return result;
}

function booleanNodeToString(node: BooleanNode): string {
  let result = `${node.field}:${node.value?.toString() ?? "false"}`;

  result = addNotPrefixIfNeeded(result, node.comparator);

  return result;
}

function addNotPrefixIfNeeded(
  queryString: string,
  comparator: Comparator,
): string {
  if (comparator.startsWith("not")) {
    return `(NOT ${queryString})`;
  }

  return queryString;
}
