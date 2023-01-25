import InistArkConstructor from 'inist-ark';

import { istexApiConfig } from '@/config';
import { isValidDoi } from './utils';

const InistArk = new InistArkConstructor();

/**
 * Parse `corpusFileContent` to get the number of identifiers and build the corresponding query string
 * to send to the API.
 * @param {string} corpusFileContent The .corpus file contents.
 * @returns An object providing the number of parsed identifiers and the corresponding query string
 * to send to the API.
 */
export function parseCorpusFileContent (corpusFileContent) {
  const validIdTypes = ['ark', 'id'];
  const lines = corpusFileContent.split('\n');
  const arks = [];
  const istexIds = [];
  const queryString = [];

  // The identifiers are at the end of the file so it's more efficient to go through
  // the lines backwards
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();

    if (!line) continue;

    // The line containing '[ISTEX]' indicates that we reached the header of the file
    // so we can break out of the loop
    if (line === '[ISTEX]') break;

    // Split the line to get arrays like ['ark', '<ark>', ...] or ['id', '<id>', ...]
    const lineSegments = line
      .split('#')[0] // Only keep what is before the potential comment
      .split(' ') // Separate the words
      .filter(token => token !== ''); // Remove the empty strings

    // At this point, if lineSegments is empty, it means the line was not an empty string but only
    // contained spaces and this is not seen as an error
    if (lineSegments.length === 0) continue;

    // The first segment of the line needs to be a valid ID type
    if (!validIdTypes.includes(lineSegments[0])) {
      const err = new Error('Syntax error');
      err.line = i + 1;
      throw err;
    }

    const [idType, idValue] = lineSegments;

    if (idType === 'ark') {
      try {
        InistArk.parse(idValue);
      } catch (err) {
        err.line = i + 1;
        throw err;
      }

      arks.push(idValue);
    } else if (idType === 'id') {
      istexIds.push(idValue);
    }
  }

  if (arks.length > 0) {
    queryString.push(buildQueryStringFromArks(arks));
  }

  if (istexIds.length > 0) {
    queryString.push(buildQueryStringFromIstexIds(istexIds));
  }

  return {
    numberOfIds: arks.length + istexIds.length,
    queryString: queryString.join(' OR '),
  };
}

/**
 * Build the query string to request the ARK identifiers in `arks`.
 * @param {string[]} arks The array containing the ARK identifiers.
 * @returns A properly formatted query string to request the ARK identifiers in `arks`.
 */
export function buildQueryStringFromArks (arks) {
  const formattedArks = arks
    .filter(ark => ark !== '')
    .map((ark, index) => {
      const trimmedArk = ark.trim();

      try {
        InistArk.parse(trimmedArk);
      } catch (err) {
        err.line = index + 1;
        throw err;
      }

      return `"${trimmedArk}"`;
    });

  return `arkIstex.raw:(${formattedArks.join(' ')})`;
}

/**
 * Build the query string to request the Istex IDs in `istexIds`.
 * @param {string[]} istexIds The array containing the Istex IDs.
 * @returns A properly formatted query string to request the Istex IDs in `istexIds`.
 */
export function buildQueryStringFromIstexIds (istexIds) {
  const formattedIds = istexIds.map(id => `"${id.trim()}"`);

  return `id:(${formattedIds.join(' ')})`;
}

/**
 * Build the query string to the request the DOIs in `doiList`.
 * @param {string[]} doiList The array containing the DOIs.
 * @returns A properly formatted query string to request the DOIs in `doiList`.
 */
export function buildQueryStringFromDoiList (doiList) {
  const formattedDoiList = doiList.map(doi => `"${doi.trim()}"`);

  return `doi:(${formattedDoiList.join(' ')})`;
}

/**
 * Check if `queryString` has the format `arkIstex.raw:("<ark1>" "<ark2>"...)`.
 * @param {string} queryString The query string to check.
 * @returns `true` if `queryString` has the format `arkIstex.raw:("<ark1>" "<ark2>"...)`, `false` otherwise.
 */
export function isArkQueryString (queryString) {
  const arkFieldName = 'arkIstex.raw';
  if (!queryString.startsWith(arkFieldName)) {
    return false;
  }

  const arks = getIdsFromIdQueryString(arkFieldName, queryString);
  const hasInvalidArk = arks.some(ark => InistArk.validate(ark).ark === false);

  return !hasInvalidArk;
}

/**
 * Extract ARK identifiers from an ARK query string. This assumes `queryString` is an ARK query string.
 * @param {string} queryString The query string to extract the ARK identifiers from.
 * @returns An array of ARK identifiers.
 */
export function getArksFromArkQueryString (queryString) {
  return getIdsFromIdQueryString('arkIstex.raw', queryString);
}

/**
 * Check if `queryString` has the format `id:("<id1>" "<id2>"...)`.
 * @param {string} queryString The query string to check.
 * @returns `true` if `queryString` has the format `id:("<id1>" "<id2>"...)`, `false` otherwise.
 */
export function isIstexIdQueryString (queryString) {
  // Regex to check if queryString starts with 'id:(', ends with ')', and contains sequences of
  // characters surrounded by double-quotes between the parentheses. This doesn't make sure each sequence of
  // characters is a valid Istex ID.
  const istexIdQueryStringRegex = /^(?:id:\((?:".*"?)*\))$/gi;

  return istexIdQueryStringRegex.test(queryString);
}

/**
 * Extract Istex identifiers from an Istex ID query string. This assumes `queryString` is an Istex ID query string.
 * @param {string} queryString The query string the extract the Istex identifiers from.
 * @returns An array of Istex identifiers.
 */
export function getIstexIdsFromIstexIdQueryString (queryString) {
  return getIdsFromIdQueryString('id', queryString);
}

/**
 * Check if `queryString` has the format `doi:("<doi1>" "<doi2>"...)`.
 * @param {string} queryString The query string to check.
 * @returns `true` if `queryString` has the format `doi:("<doi1>" "<doi2>"...)`, `false` otherwise.
 */
export function isDoiQueryString (queryString) {
  const doiFieldName = 'doi';
  if (!queryString.startsWith(doiFieldName)) {
    return false;
  }

  const dois = getIdsFromIdQueryString(doiFieldName, queryString);
  const hasInvalidDoi = dois.some(doi => isValidDoi(doi) === false);

  return !hasInvalidDoi;
}

/**
 * Extract DOIs from a DOI query string. This assumes `queryString` is a DOI query string.
 * @param {string} queryString The query string the extract the DOIs from.
 * @returns An array of DOIs.
 */
export function getDoisFromDoiQueryString (queryString) {
  return getIdsFromIdQueryString('doi', queryString);
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
 * Extract identifiers from a query string.
 * @param {string} idFieldName The name of the ID field in the API.
 * @param {string} queryString The query string to extract the identifiers from.
 * @returns An array of identifiers
 */
function getIdsFromIdQueryString (idFieldName, queryString) {
  // Get rid of '${idFieldName}:(' at the beginning of queryString
  queryString = queryString.substring(`${idFieldName}:(`.length);

  // Get rid of the last parenthesis at the end of queryString
  queryString = queryString.substring(0, queryString.length - 1);

  // Get rid of the double-quotes (") surrounding each identifier
  queryString = queryString.replace(/"/g, '');

  return queryString.split(' ');
}
