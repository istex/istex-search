import { istexApiConfig, supportedIdTypes } from '@/config';

const MAX_NUMBER_OF_ERRORS = 20;

/**
 * Parse `corpusFileContent` to get the number of identifiers and build the corresponding query string
 * to send to the API.
 * @param {string} corpusFileContent The .corpus file contents.
 * @returns An object providing the number of parsed identifiers and the corresponding query string
 * to send to the API.
 */
export function parseCorpusFileContent (corpusFileContent) {
  const lines = corpusFileContent.split('\n');
  const queryString = [];
  const errorLines = [];

  // Build an object that will hold an array for each supported ID type and the functions to validate
  // them and build the query string
  const ids = {};
  for (const idTypeInfo of Object.values(supportedIdTypes)) {
    ids[idTypeInfo.corpusFilePrefix] = {
      list: [],
      isValidId: idTypeInfo.isValidId,
      buildQueryString: idTypeInfo.buildQueryString,
    };
  }

  // Go through the lines until we reach the line containing '[ISTEX]' because we don't care about
  // what is before it
  let lineIndex = 0;
  while (lines[lineIndex].trim() !== '[ISTEX]') {
    lineIndex++;
  }

  // At this point lineIndex points to the line containing '[ISTEX]' so we need to increment it once
  // more to start parsing
  lineIndex++;

  // Start at the line right after '[ISTEX]'
  for (; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex].trim();

    if (!line) continue;

    // Split the line to get arrays like ['ark', '<ark>', ...] or ['id', '<id>', ...]
    const lineSegments = line
      .split('#')[0] // Only keep what is before the potential comment
      .split(' ') // Separate the words
      .filter(token => token !== ''); // Remove the empty strings

    // At this point, if lineSegments is empty, it means the line was not an empty string but only
    // contained spaces and this is not seen as an error
    if (lineSegments.length === 0) continue;

    const [idType, idValue] = lineSegments;

    // idType needs to be a supported ID type and idValue must be a valid ID of idType
    if (!ids[idType] || !ids[idType].isValidId(idValue)) {
      errorLines.push(lineIndex + 1);

      // If the maximum number of errors is reached, throw early
      if (errorLines.length >= MAX_NUMBER_OF_ERRORS) {
        const err = new Error('Syntax errors');
        err.lines = errorLines;
        throw err;
      }

      continue;
    }

    ids[idType].list.push(idValue);
  }

  // Throw if errors were found
  if (errorLines.length > 0) {
    const err = new Error('Syntax errors');
    err.lines = errorLines;
    throw err;
  }

  // Build the query string and calculate to total amount of IDs
  let numberOfIds = 0;
  for (const id of Object.values(ids)) {
    if (id.list.length > 0) {
      queryString.push(id.buildQueryString(id.list));
      numberOfIds += id.list.length;
    }
  }

  return {
    numberOfIds,
    queryString: queryString.join(' OR '),
  };
}

/**
 * Check if `id` is of a supported identifier type and return the appropriate object inside `supportedIds`.
 * @param {string} id The identifier to use to find the appropriate object.
 * @returns The appropriate object inside `supportedIds`.
 * @example getIdTypeInfoFromId('ark:/67375/NVC-8SNSRJ6Z-Z') // => supportedIds.ark
 */
export function getIdTypeInfoFromId (id) {
  return Object.values(supportedIdTypes).find(idTypeInfo => idTypeInfo.isValidId(id));
}

/**
 * Check if `queryString` is of a supported identifier type and return the appropriate object inside `supportedIds`.
 * @param {string} queryString The query string to deduce the ID type from.
 * @returns The appropriate object inside `supportedIds`.
 * @example getIdTypeInfoFromQueryString('arkIstex.raw:("ark:/67375/NVC-8SNSRJ6Z-Z")') // => supportedIds.ark
 */
export function getIdTypeInfoFromQueryString (queryString) {
  return Object.values(supportedIdTypes).find(idTypeInfo => idTypeInfo.isValidQueryString(queryString));
}

/**
 * Build the query string to request the ARK identifiers in `arks`.
 * @param {string[]} arks The array containing the ARK identifiers.
 * @returns A properly formatted query string to request the ARK identifiers in `arks`.
 */
export function buildQueryStringFromArks (arks) {
  return buildQueryStringFromIds(supportedIdTypes.ark, arks);
}

/**
 * Check if `queryString` has the format `arkIstex.raw:("<ark1>" "<ark2>"...)`.
 * @param {string} queryString The query string to check.
 * @returns `true` if `queryString` has the format `arkIstex.raw:("<ark1>" "<ark2>"...)`, `false` otherwise.
 */
export function isArkQueryString (queryString) {
  return isIdQueryString(supportedIdTypes.ark, queryString);
}

/**
 * Extract ARK identifiers from an ARK query string. This assumes `queryString` is an ARK query string.
 * @param {string} queryString The query string to extract the ARK identifiers from.
 * @returns An array of ARK identifiers.
 */
export function getArksFromArkQueryString (queryString) {
  return getIdsFromIdQueryString(supportedIdTypes.ark.fieldName, queryString);
}

/**
 * Build the query string to request the Istex IDs in `istexIds`.
 * @param {string[]} istexIds The array containing the Istex IDs.
 * @returns A properly formatted query string to request the Istex IDs in `istexIds`.
 */
export function buildQueryStringFromIstexIds (istexIds) {
  return buildQueryStringFromIds(supportedIdTypes.istexId, istexIds);
}

/**
 * Check if `queryString` has the format `id:("<id1>" "<id2>"...)`.
 * @param {string} queryString The query string to check.
 * @returns `true` if `queryString` has the format `id:("<id1>" "<id2>"...)`, `false` otherwise.
 */
export function isIstexIdQueryString (queryString) {
  return isIdQueryString(supportedIdTypes.istexId, queryString);
}

/**
 * Extract Istex identifiers from an Istex ID query string. This assumes `queryString` is an Istex ID query string.
 * @param {string} queryString The query string the extract the Istex identifiers from.
 * @returns An array of Istex identifiers.
 */
export function getIstexIdsFromIstexIdQueryString (queryString) {
  return getIdsFromIdQueryString(supportedIdTypes.istexId.fieldName, queryString);
}

/**
 * Build the query string to the request the DOIs in `dois`.
 * @param {string[]} dois The array containing the DOIs.
 * @returns A properly formatted query string to request the DOIs in `dois`.
 */
export function buildQueryStringFromDois (dois) {
  return buildQueryStringFromIds(supportedIdTypes.doi, dois);
}

/**
 * Check if `queryString` has the format `doi:("<doi1>" "<doi2>"...)`.
 * @param {string} queryString The query string to check.
 * @returns `true` if `queryString` has the format `doi:("<doi1>" "<doi2>"...)`, `false` otherwise.
 */
export function isDoiQueryString (queryString) {
  return isIdQueryString(supportedIdTypes.doi, queryString);
}

/**
 * Extract DOIs from a DOI query string. This assumes `queryString` is a DOI query string.
 * @param {string} queryString The query string the extract the DOIs from.
 * @returns An array of DOIs.
 */
export function getDoisFromDoiQueryString (queryString) {
  return getIdsFromIdQueryString(supportedIdTypes.doi.fieldName, queryString);
}

/**
 * Check whether the query string is too long to be sent as a GET request.
 * @param {string} queryString The query string URL search parameter.
 * @returns `true` if `queryString` is longer than `istexApiConfig.queryStringMaxLength`, `false` otherwise.
 */
export function isQueryStringTooLong (queryString) {
  return queryString.length > istexApiConfig.queryStringMaxLength;
}

/**
 * Build the query string to request the identifiers in `ids`.
 * @param {object} idTypeInfo One of the object in `supportedIdTypes`.
 * @param {string[]} ids The list of identifiers to build the query string from.
 * @returns A properly formatted query string to request the identifiers in `ids`.
 */
function buildQueryStringFromIds (idTypeInfo, ids) {
  const errorLines = [];

  const formattedIds = ids
    .map(id => id.trim())
    .filter(id => id !== '')
    .map((id, lineIndex) => {
      if (!idTypeInfo.isValidId(id)) {
        errorLines.push(lineIndex + 1);

        // If the maximum number of errors is reached, throw early
        if (errorLines.length >= MAX_NUMBER_OF_ERRORS) {
          const err = new Error('Syntax errors');
          err.lines = errorLines;
          throw err;
        }
      }

      return `"${id}"`;
    });

  // Throw if errors were found
  if (errorLines.length > 0) {
    const err = new Error('Syntax errors');
    err.lines = errorLines;
    throw err;
  }

  return `${idTypeInfo.fieldName}:(${formattedIds.join(' ')})`;
}

/**
 * Check if `queryString` has the format `<idType>:("<id1>" "<id2>"...)`.
 * @param {object} idTypeInfo One of the object in `supportedIdTypes`.
 * @param {string} queryString The query string to check.
 * @returns `true` if `queryString` has the format `<idType>:("<id1>" "<id2>"...)`, `false` otherwise.
 */
function isIdQueryString (idTypeInfo, queryString) {
  queryString = queryString.trim();

  if (!queryString.startsWith(idTypeInfo.fieldName)) {
    return false;
  }

  const ids = getIdsFromIdQueryString(idTypeInfo.fieldName, queryString);
  const hasInvalidId = ids.some(id => idTypeInfo.isValidId(id) === false);

  return !hasInvalidId;
}

/**
 * Extract identifiers from a query string.
 * @param {string} idFieldName The name of the ID field in the API.
 * @param {string} queryString The query string to extract the identifiers from.
 * @returns An array of identifiers
 */
function getIdsFromIdQueryString (idFieldName, queryString) {
  queryString = queryString.trim();

  // Get rid of '${idFieldName}:(' at the beginning of queryString
  queryString = queryString.substring(`${idFieldName}:(`.length);

  // Get rid of the last parenthesis at the end of queryString
  queryString = queryString.substring(0, queryString.length - 1);

  // Get rid of the double-quotes (") surrounding each identifier
  queryString = queryString.replace(/"/g, '');

  return queryString.split(' ');
}
