import type { SxProps } from "@mui/system/styleFunctionSx";
import type { ColumnId } from "@/types/next";

export function lineclamp(lines: number): SxProps {
  return {
    display: "-webkit-box",
    WebkitLineClamp: lines,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };
}

export function clamp(number: number, min: number, max: number) {
  return Math.max(min, Math.min(number, max));
}

export function closest(number: number, values: number[] | readonly number[]) {
  return values.reduce((prev, curr) =>
    Math.abs(curr - number) < Math.abs(prev - number) ? curr : prev,
  );
}

export function isValidMd5(hash: string) {
  return /^[a-f0-9]{32}$/gi.test(hash);
}

/**
 * Check if `doi` is a valid DOI.
 * @param {string} doi The DOI to check.
 * @returns `true` if `doi` is a valid DOI, `false` otherwise.
 */
export function isValidDoi(doi: string) {
  return /\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&'])\S)+)\b/gi.test(doi);
}

/**
 * Check if `istexId` is a valid Istex identifier.
 * @param {string} istexId The Istex identifier to check.
 * @returns `true` if `istexId` is a valid Istex identifier, `false` otherwise.
 */
export function isValidIstexId(istexId: string) {
  return /ark:\/67375\/[0-9B-DF-HJ-NP-TV-XZ]{3}-[0-9B-DF-HJ-NP-TV-XZ]{8}-[0-9B-DF-HJ-NP-TV-XZ]/.test(
    istexId,
  );
}

/**
 * Function to build a query from a list of ids written in the searchBar (when "import list" option is selected)
 * @param column column to search in
 * @param ids search bar content who contains the list of ids
 * @returns an Object with the query (who contains ids separated by "OR") and the error lines (if there is any)
 */
export function buildQueryFromIds(column: ColumnId, ids: string) {
  let queryPart = "";
  let isFirst = true;
  const errorLines: number[] = [];
  let lineIndex = 1;
  ids.split("\n").forEach((line) => {
    if (line.trim() !== "") {
      // add the line to the query
      if (isFirst) {
        queryPart = queryPart.concat(`"${line}"`);
        isFirst = false;
      } else {
        queryPart = queryPart.concat(" OR ", `"${line}"`);
      }
      // check if the line is valid
      if (
        (column === "doi" && !isValidDoi(line)) ||
        (column === "arkIstex" && !isValidIstexId(line))
      ) {
        errorLines.push(lineIndex);
      }
      lineIndex++;
    }
  });
  return {
    errorLines,
    query: `${column}:${queryPart}`,
  };
}

/**
 * Function to get Ids from a query from retrieved from url if possible
 * @param {string} query to get ids from
 * @returns {string} ids query separated by a line break or query if not possible
 */
export function getIdsFromQuery(query: string) {
  const ids = query.split("AND")[0].match(/"([^"]+)"/g);
  if (ids != null) {
    return ids.join("\n").replaceAll('"', "");
  }
  return query;
}

/**
 * Parse `corpusFileContent` to build the corresponding query string to send to the API.
 * @param {string} corpusFileContent The .corpus file content
 * @returns The query string to send to the API.
 */
export function parseCorpusFileContent(corpusFileContent: string) {
  const lines = corpusFileContent.split("\n");
  const ids = [];
  let lineIndex = 0;

  while (lines[lineIndex].trim() !== "[ISTEX]") {
    lineIndex++;
  }

  for (; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex].trim();

    if (line === "") continue;

    const lineSegments = line
      .split("#")[0] // Only keep what is before the potential comment
      .split(" ") // Separate the words
      .filter((token) => token !== ""); // Remove the empty strings

    lineSegments.length > 1 && ids.push(lineSegments[1]);
  }

  return ids.join("\n");
}
