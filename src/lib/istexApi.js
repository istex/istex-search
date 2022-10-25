import axios from 'axios';
import InistArkConstructor from 'inist-ark';
import { istexApiConfig, formats } from '../config';

const InistArk = new InistArkConstructor();

/**
 * Parse `corpusFileContent` to get the number of identifiers and build the corresponding query string
 * to send to the API.
 * @param {string} corpusFileContent The .corpus file contents.
 * @returns An object providing the number of parsed identifiers and the corresponding query string
 * to send to the API.
 */
export function parseCorpusFileContent (corpusFileContent) {
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

    // If the line contains less than 2 segments, it means it does not have the format 'ark <ark>' or 'id <id>'
    // so we just skip it
    if (lineSegments.length < 2) continue;

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
 * Build the query string to request the Istex IDs in `istexIds`
 * @param {string[]} istexIds The array containing the Istex IDs
 * @returns A properly formatted query string to request the Istex IDs in `istexIds`
 */
export function buildQueryStringFromIstexIds (istexIds) {
  const formattedIds = istexIds.map(id => `"${id.trim()}"`);

  return `id:(${formattedIds.join(' ')})`;
}

/**
 * Build the query string to request the ark identifiers in `arks`.
 * @param {string[]} arks The array containing the ark identifiers.
 * @returns A properly formatted query string to request the ark identifiers in `arks`.
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
 * Check if `queryString` has the format `arkIstex.raw:("<ark1>" "<ark2>"...)`.
 * @param {string} queryString The query string to check.
 * @returns `true` if `queryString` has the format `arkIstex.raw:("<ark1>" "<ark2>"...)`, `false` otherwise.
 */
export function isArkQueryString (queryString) {
  // Regex to check if queryString starts with 'arkIstex.raw:(', ends with '(', and contains sequences of
  // characters surrounded by double-quotes between the parentheses. This doesn't make sure each sequence of
  // characters is a valid ark.
  const arkQueryStringRegex = /^(?:arkIstex\.raw:\((?:".*"?)*\))$/gi;

  if (!arkQueryStringRegex.test(queryString)) {
    return false;
  }

  const arks = getArksFromArkQueryString(queryString);
  const hasInvalidArk = arks.some(ark => InistArk.validate(ark).ark === false);

  return !hasInvalidArk;
}

/**
 * Extract ark identifiers from an ark query string. This assumes `queryString` is an ark query string.
 * @param {string} queryString The query string the extract the ark identifiers from.
 * @returns An array of ark identifiers, `null` if `queryString` is not an ark query string.
 */
export function getArksFromArkQueryString (queryString) {
  // Get rid of 'arkIstex.raw:(' at the beginning of queryString
  queryString = queryString.substring('arkIstex.raw:('.length);

  // Get rid of the last parenthesis at the end of queryString
  queryString = queryString.substring(0, queryString.length - 1);

  // Get rid of the double-quotes (") surrounding each ark identifier
  queryString = queryString.replace(/"/g, '');

  return queryString.split(' ');
}

/**
 * Build the extract parameter from the selected formats.
 * @param {number} selectedFormats The selected formats as in integer.
 * @returns The extract parameter as a string.
 * @example 'fulltext[txt,pdf];metadata[multicat,nb]'
 */
export function buildExtractParamsFromFormats (selectedFormats) {
  const extractParams = [];

  // Build every category (fulltext, metadata and enrichments) of the extract parameter
  for (const formatCategory in formats) {
    const currentCategoryParams = [];

    // Cases of covers and annexes which are not in a category
    if (formats[formatCategory].value !== undefined) {
      if (isFormatSelected(selectedFormats, formats[formatCategory].value)) {
        extractParams.push(formatCategory);
      }
      continue;
    }

    // Build every format of the current category (e.g. pdf, txt for the fulltext category)
    for (const currentCategoryFormat in formats[formatCategory].formats) {
      if (isFormatSelected(selectedFormats, formats[formatCategory].formats[currentCategoryFormat].value)) {
        currentCategoryParams.push(currentCategoryFormat);
      }
    }

    // Only add the category if the category is not empty
    if (currentCategoryParams.length > 0) {
      extractParams.push(`${formatCategory}[${currentCategoryParams.join(',')}]`);
    }
  }

  return extractParams.join(';');
}

/**
 * Parse the extract URL parameter and create the selected formats integer.
 * @param {string} extractParamsAsString The extract URL parameter (e.g. `fulltext[txt,pdf];metadata[multicat,nb]`).
 * @returns The selected formats as an integer.
 */
export function parseExtractParams (extractParamsAsString) {
  let selectedFormats = 0;

  // Get the categories by splitting with ';' and only keep the supported format categories
  const formatCategories = extractParamsAsString.split(';')
    .filter(category => {
      // category would look like this: 'fulltext[txt,pdf]' so we
      // need to make sure supportedFormatCategory is at the beginning of category
      for (const supportedFormatCategory in formats) {
        if (category.startsWith(supportedFormatCategory)) return true;
      }
      return false;
    });

  for (const formatCategory of formatCategories) {
    const indexOfOpeningBracket = formatCategory.indexOf('[');
    const indexOfClosingBracket = formatCategory.indexOf(']');

    // If formatCategory does not contain '[' and ']', it means it's 'covers' or 'annexes'
    if (indexOfOpeningBracket === -1 || indexOfClosingBracket === -1) {
      if (formats[formatCategory].value !== undefined) {
        selectedFormats = selectFormat(selectedFormats, formats[formatCategory].value);
      }
      continue;
    }

    // Get the format category name (e.g. for 'fulltext[txt,pdf]' get 'fulltext')
    const formatCategoryName = formatCategory.substring(0, indexOfOpeningBracket);

    // Get the formats within formatCategoryName and only keep the supported formats
    const currentCategoryFormats = formatCategory.substring(indexOfOpeningBracket + 1, indexOfClosingBracket)
      .split(',')
      .filter(categoryFormat => Object.keys(formats[formatCategoryName].formats).includes(categoryFormat));

    for (const currentCategoryFormat of currentCategoryFormats) {
      selectedFormats = selectFormat(selectedFormats, formats[formatCategoryName].formats[currentCategoryFormat].value);
    }
  }

  return selectedFormats;
}

/**
 * Build the URL to be used when sending a request to the ISTEX API.
 * @param {string} queryString The query string (not needed if `qId` is present).
 * @param {string} qId The q_id (not needed if `queryString` is present).
 * @param {number} selectedFormats The selected formats as an integer (bit field).
 * @param {string} rankingMode The ranking mode.
 * @param {number} numberOfDocuments The maximum number of documents.
 * @param {0|6|9} compressionLevel The level of compression.
 * @param {'zip'|'tar'} archiveType The type of archive.
 * @returns The full URL as an `URL` object.
 */
export function buildFullApiUrl ({ queryString, qId, selectedFormats, rankingMode, numberOfDocuments, compressionLevel, archiveType }) {
  // If no format is selected, return early and don't add the extract parameter
  if (!selectedFormats) return null;

  const extractParams = buildExtractParamsFromFormats(selectedFormats);

  // Build the final URL object
  const url = new URL('document', istexApiConfig.baseUrl);

  if (qId) {
    url.searchParams.set('q_id', qId);
  } else {
    url.searchParams.set('q', queryString);
  }

  url.searchParams.set('extract', extractParams);
  url.searchParams.set('size', numberOfDocuments);
  url.searchParams.set('rankBy', rankingMode);
  url.searchParams.set('compressionLevel', compressionLevel);
  url.searchParams.set('archiveType', archiveType);
  url.searchParams.set('sid', 'istex-dl');

  return url;
}

// The selected formats are represented as an integer where each bit represents a format
// so we use bitwise operators to select/deselect formats (cf. https://stackoverflow.com/a/47990)

/**
 * Select `formatToSelect` in `baseFormat`.
 * @param {number} baseFormat The format to select in.
 * @param {number} formatToSelect The format to select.
 * @returns `baseFormat` after selecting `formatToSelect` in it.
 */
export function selectFormat (baseFormat, formatToSelect) {
  return baseFormat | formatToSelect;
}

/**
 * Deselect `formatToDeselect` in `baseFormat`.
 * @param {number} baseFormat The format to deselect in.
 * @param {number} formatToDeselect The format to deselect.
 * @returns `baseFormat` after deselecting `formatToDeselect` in it.
 */
export function deselectFormat (baseFormat, formatToDeselect) {
  return baseFormat & ~formatToDeselect;
}

/**
 * Toggle `formatToToggle` in `baseFormat`.
 * @param {number} baseFormat The format to toggle in.
 * @param {number} formatToToggle The format to toggle.
 * @returns `baseFormat` after toggling `formatToToggle` in it.
 */
export function toggleFormat (baseFormat, formatToToggle) {
  return baseFormat ^ formatToToggle;
}

/**
 * Returns a format with nothing selected (0).
 * @returns A format with nothing selected (0).
 */
export function noFormatSelected () {
  return 0;
}

/**
 * Check if `formatToCheck` is selected in `baseFormat`.
 * @param {number} baseFormat The format to check in.
 * @param {number} formatToCheck Teh format to check.
 * @returns `true` if `formatToCheck` is selected in `baseFormat`. `false` otherwise.
 */
export function isFormatSelected (baseFormat, formatToCheck) {
  return (baseFormat & formatToCheck) === formatToCheck;
}

/**
 * Verify is query search is too long. some browsers won't accept to send a GET request so we send a POST request
 * @param {string} queryString The query string URL search parameter.
 * @returns A `Boolean`.
 */
export function checkIfQueryIsTooLong (queryString) {
  return queryString.length > istexApiConfig.queryStringMaxLength;
}

/**
 * Send a request to the ISTEX API to preview the results that will be in the archive.
 * @param {string} queryString The query string URL search parameter.
 * @param {string} rankingMode The ranking mode URL search parameter.
 * @returns A `Promise`.
 */
export function sendResultPreviewApiRequest (queryString, rankingMode, currentPageURI) {
  if (currentPageURI && checkIfQueryIsTooLong(queryString)) {
    return axios.post(currentPageURI, {
      qString: queryString,
    });
    // return axios.get(currentPageURI);
  } else if (currentPageURI && !checkIfQueryIsTooLong(queryString)) {
    return axios.get(currentPageURI);
  }

  const url = new URL('document', istexApiConfig.baseUrl);
  url.searchParams.set('rankBy', rankingMode);
  url.searchParams.set('size', 9);
  url.searchParams.set('output', '*');
  url.searchParams.set('sid', 'istex-dl');

  // If the query string is too long some browsers won't accept to send a GET request so we send a POST request
  // instead and pass the query string in the body
  if (checkIfQueryIsTooLong(queryString)) {
    return axios.post(url.toString(), {
      qString: queryString,
    });
  }

  url.searchParams.set('q', queryString);

  return axios.get(url.toString());
}

/**
 * Send a request to the ISTEX API to download the archive (this function is synchronous).
 * @param {string} url The URL to download the archive.
 */
export function sendDownloadApiRequest (url) {
  // Hack to download the archive and see the progression in the download bar built in browsers
  // We create a fake 'a' tag that points to the URL we just built and simulate a click on it
  const link = document.createElement('a');
  link.href = url;

  link.click();
}

/**
 * Send a request to the ISTEX API to save `qId` and `queryString` in the redis base.
 * @param {string} qId The q_id to save in the redis base.
 * @param {string} queryString The query string associated with `qId`.
 */
export function sendSaveQIdApiRequest (qId, queryString) {
  const url = new URL(`q_id/${qId}`, istexApiConfig.baseUrl);

  return axios.post(url.toString(), {
    qString: queryString,
  });
}

/**
 * Send a request to the ISTEX API to get the query string corresponding to `qId`.
 * @param {string} qId The qId (md5 hash of a query string).
 * @returns A `Promise`.
 */
export function getQueryStringFromQId (qId) {
  const url = new URL(`q_id/${qId}`, istexApiConfig.baseUrl);

  return axios.get(url.toString());
}
