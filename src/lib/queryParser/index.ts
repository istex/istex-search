import type { AST } from "lucene";
import * as internalParser from "./parser.js";

export function parseQueryString(queryString: string): AST {
  const trimmedQueryString = queryString.trim();
  if (trimmedQueryString === "") {
    throw internalParser.SyntaxError("Empty queries are not allowed");
  }

  return internalParser.parse(trimmedQueryString);
}
