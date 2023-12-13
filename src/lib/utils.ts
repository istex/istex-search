import type { SxProps } from "@mui/system/styleFunctionSx";

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
 * @param ids search bar content who contains the list of ids
 * @returns ids query separated by "OR"
 */
export function buildQueryFromIds(ids: string) {
  let queryPart = "";
  let isFirst = true;
  ids.split("\n").forEach((line) => {
    if (line.trim() !== "") {
      if (isFirst) {
        queryPart = queryPart.concat(`"${line}"`);
        isFirst = false;
      } else {
        queryPart = queryPart.concat(" OR ", `"${line}"`);
      }
    }
  });
  return queryPart;
}

/**
 * Function to get Ids from a query from retrieved from url if possible
 * @param {string} query to get ids from
 * @returns {string} ids query separated by a line break or query if not possible
 */
export function getIdsFromQuery(query: string) {
  const ids = query.match(/"([^"]+)"/g);
  if (ids != null) {
    return ids.join("\n").replaceAll('"', "");
  }
  return query;
}
