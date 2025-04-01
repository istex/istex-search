import CustomError from "./CustomError";
import { supportedIdTypes, type SupportedIdType } from "@/config";

const MAX_NUMBER_OF_ERRORS = 20;

export interface CorpusFileParsingResult {
  ids: string[];
  queryString: string;
}

export function parseCorpusFileContent(
  corpusFileContent: string,
): CorpusFileParsingResult {
  const lines = corpusFileContent.split("\n");
  const ids: string[] = [];
  let idType: SupportedIdType | undefined;
  const errorLines: number[] = [];
  let istexLineFound = false;

  // Start at the line right after '[ISTEX]'
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex].trim();

    // Skip empty lines
    if (line === "") {
      continue;
    }

    // The line containing '[ISTEX]' indicates the start of the IDs
    if (line.trim() === "[ISTEX]") {
      istexLineFound = true;
      continue;
    }

    // We don't care about the lines before '[ISTEX]' so we just skip until we find it
    if (!istexLineFound) {
      continue;
    }

    // Split the line to get arrays like ['ark', '<ark>', ...] or ['id', '<id>', ...]
    const lineSegments = line
      .split("#")[0] // Only keep what is before the potential comment
      .split(" ") // Separate the words
      .filter(Boolean); // Remove the empty strings

    // At this point, if lineSegments is empty, it means the line was not an empty string but only
    // contained spaces and this is not seen as an error
    if (lineSegments.length === 0) continue;

    const [corpusFilePrefix, id] = lineSegments;

    // If the idType hasn't been found yet, find it based on the id prefix
    idType ??= supportedIdTypes.find(
      (idType) => idType.corpusFilePrefix === corpusFilePrefix,
    );

    // If the idType hasn't been found at this point, it means there's a syntax error
    if (idType == null) {
      errorLines.push(lineIndex + 1);

      // If the maximum number of errors is reached, throw early
      if (errorLines.length >= MAX_NUMBER_OF_ERRORS) {
        throw new CustomError({
          name: "IdsError",
          count: errorLines.length,
          lines: errorLines.join(", "),
        });
      }

      continue;
    }

    // id must be a valid ID of idType
    if (!idType.isValidId(id)) {
      errorLines.push(lineIndex + 1);

      // If the maximum number of errors is reached, throw early
      if (errorLines.length >= MAX_NUMBER_OF_ERRORS) {
        throw new CustomError({
          name: "IdsError",
          count: errorLines.length,
          lines: errorLines.join(", "),
        });
      }

      continue;
    }

    ids.push(id);
  }

  // If the [ISTEX] line was not found, the file format is wrong
  if (!istexLineFound) {
    throw new CustomError({
      name: "CorpusFileFormatError",
    });
  }

  // Throw if errors were found
  if (errorLines.length > 0 || idType == null) {
    throw new CustomError({
      name: "IdsError",
      count: errorLines.length,
      lines: errorLines.join(", "),
    });
  }

  return {
    ids,
    queryString: buildQueryStringFromIds(idType, ids),
  };
}

export function buildQueryStringFromIds(
  idType: SupportedIdType,
  ids: string[],
): string {
  const errorLines: number[] = [];

  const formattedIds = ids
    .map((id) => id.trim())
    .map((id, lineIndex) => {
      // We don't simply filter the empty IDs because we need to get correct
      // line numbers if an error is detected. The empty IDs are filtered
      // when creating the Lucene query
      if (id === "") {
        return "";
      }

      if (!idType.isValidId(id)) {
        errorLines.push(lineIndex + 1);

        // If the maximum number of errors is reached, throw early
        if (errorLines.length >= MAX_NUMBER_OF_ERRORS) {
          throw new CustomError({
            name: "IdsError",
            count: errorLines.length,
            lines: errorLines.join(", "),
          });
        }
      }

      return `"${id}"`;
    });

  // Throw if errors were found
  if (errorLines.length > 0) {
    throw new CustomError({
      name: "IdsError",
      count: errorLines.length,
      lines: errorLines.join(", "),
    });
  }

  return `${idType.fieldName}:(${formattedIds.filter(Boolean).join(" ")})`;
}

export function isIdQueryString(
  idType: SupportedIdType,
  queryString: string,
): boolean {
  return queryString.trim().startsWith(idType.fieldName);
}

export function getIdTypeFromQueryString(
  queryString: string,
): SupportedIdType | null {
  return (
    supportedIdTypes.find((idType) => isIdQueryString(idType, queryString)) ??
    null
  );
}

export function getIdTypeFromId(id: string): SupportedIdType | null {
  return supportedIdTypes.find((idType) => idType.isValidId(id)) ?? null;
}

export function getIdsFromQueryString(
  idType: SupportedIdType | null,
  queryString: string,
): string[] {
  if (idType == null) {
    return [];
  }

  queryString = queryString.trim();

  // Get rid of '${idType.fieldName}:(' at the beginning of queryString
  queryString = queryString.substring(`${idType.fieldName}:(`.length);

  // Get rid of the last parenthesis at the end of queryString
  queryString = queryString.substring(0, queryString.length - 1);

  // Get rid of the double-quotes (") surrounding each identifier
  queryString = queryString.replace(/"/g, "");

  return queryString.split(" ");
}
