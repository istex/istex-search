import axios from 'axios';
import { istexApiConfig, formats } from '../config';

/**
 * Build the query string to request the documents in `corpusFileContent`.
 * @param {string} corpusFileContent The .corpus file contents.
 * @returns The query string to request the documents in the .corpus file.
 */
export function buildQueryStringFromCorpusFile (corpusFileContent) {
  const lines = corpusFileContent.split('\n');
  const arks = [];

  // The ark identifiers are at the end of the file so it's more efficient to go through
  // the lines backwards
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];

    // The line containing '[ISTEX]' indicates that we reached the header of the file
    // so we can break out of the loop
    if (line === '[ISTEX]') break;

    // The format for the lines with an ark identifier is: 'ark <arkIstex>' so we need to remove
    // 'ark ' (4 characters) at the beginning of the line to extract the identifier
    arks.push(line.substring(4));
  }

  return buildQueryStringFromArks(arks);
}

/**
 * Build the query string to request the ark identifiers in `arkString`.
 * @param {string[]} arks The array containing the ark identifiers.
 * @returns A properly formatted query string to request to arks in `arkString`.
 */
export function buildQueryStringFromArks (arks) {
  const formattedArks = [];

  for (const ark of arks) {
    formattedArks.push(`"${ark.trim()}"`);
  }

  return `arkIstex.raw(${formattedArks.join(' ')})`;
}

/**
 * Test whether `queryString` is a query string to request ark identifiers but with no identifier.
 * @param {string} queryString The query string to test.
 * @returns `true` if `queryString` is equal to `arkIstex.raw("")`, `false` otherwise.
 */
export function isEmptyArkQueryString (queryString) {
  // When the ark text input is empty, an array with an empty string is passed to
  // buildQueryStringFromArks so we test if queryString is equal to the value returned
  // by buildQueryStringFromArks when passed an array with an empty string
  return queryString === buildQueryStringFromArks(['']);
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
    if (Number.isInteger(formats[formatCategory])) {
      if (isFormatSelected(selectedFormats, formats[formatCategory])) {
        extractParams.push(formatCategory);
      }
      continue;
    }

    // Build every format of the current category (e.g. pdf, txt for the fulltext category)
    for (const currentCategoryFormat in formats[formatCategory]) {
      if (isFormatSelected(selectedFormats, formats[formatCategory][currentCategoryFormat])) {
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
      // need to make sure supportedFormatCategory is at the begging category
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
      if (Number.isInteger(formats[formatCategory])) {
        selectedFormats = selectFormat(selectedFormats, formats[formatCategory]);
      }
      continue;
    }

    // Get the format category name (e.g. for 'fulltext[txt,pdf]' get 'fulltext')
    const formatCategoryName = formatCategory.substring(0, indexOfOpeningBracket);

    // Get the formats within formatCategoryName and only keep the supported formats
    const currentCategoryFormats = formatCategory.substring(indexOfOpeningBracket + 1, indexOfClosingBracket)
      .split(',')
      .filter(categoryFormat => Object.keys(formats[formatCategoryName]).includes(categoryFormat));

    for (const currentCategoryFormat of currentCategoryFormats) {
      selectedFormats = selectFormat(selectedFormats, formats[formatCategoryName][currentCategoryFormat]);
    }
  }

  return selectedFormats;
}

/**
 * Build the URL to be used when sending a request to the ISTEX API.
 * @param {string} queryString The query string.
 * @param {number} selectedFormats The selected formats as an integer (bit field).
 * @param {string} rankingMode The ranking mode.
 * @param {number} numberOfDocuments The maximum number of documents.
 * @param {0|6|9} compressionLevel The level of compression.
 * @param {'zip'|'tar'} archiveType The type of archive.
 * @returns The full URL as an `URL` object.
 */
export function buildFullUrl ({ queryString, selectedFormats, rankingMode, numberOfDocuments, compressionLevel, archiveType }) {
  // If no format is selected, return early and don't add the extract parameter
  if (!selectedFormats) return null;

  const extractParams = buildExtractParamsFromFormats(selectedFormats);

  // Build the final URL object
  const url = new URL('document', istexApiConfig.baseUrl);
  url.searchParams.append('q', queryString);
  url.searchParams.append('extract', extractParams);
  url.searchParams.append('size', numberOfDocuments);
  url.searchParams.append('rankBy', rankingMode);
  url.searchParams.append('compressionLevel', compressionLevel);
  url.searchParams.append('archiveType', archiveType);
  url.searchParams.append('sid', 'istex-dl');

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
export function resetFormat () {
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
 * Send a request to the ISTEX API to preview the results that will be in the archive.
 * @param {string} queryString The query string URL search parameter.
 * @param {string} rankingMode The ranking mode URL search parameter.
 * @returns A `Promise`.
 */
export function sendResultPreviewApiRequest (queryString, rankingMode) {
  const url = new URL('document', istexApiConfig.baseUrl);
  url.searchParams.append('q', queryString);
  url.searchParams.append('rankBy', rankingMode);
  url.searchParams.append('size', 6);
  url.searchParams.append('output', 'author,title,host.title,publicationDate');

  return axios.get(url.toString());
}
