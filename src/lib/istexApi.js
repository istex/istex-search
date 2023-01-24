import axios from 'axios';

import { buildExtractParamsFromFormats } from './formats';
import { isQueryStringTooLong } from './query';
import { istexApiConfig } from '@/config';

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

/**
 * Send a request to the ISTEX API to preview the results that will be in the archive.
 * @param {string} queryString The query string URL search parameter.
 * @param {string} rankingMode The ranking mode URL search parameter.
 * @returns A `Promise`.
 */
export function sendResultPreviewApiRequest (queryString, rankingMode, currentPageURI) {
  if (currentPageURI && isQueryStringTooLong(queryString)) {
    return axios.post(currentPageURI, {
      qString: queryString,
    });
  } else if (currentPageURI && !isQueryStringTooLong(queryString)) {
    return axios.get(currentPageURI);
  }

  const url = new URL('document', istexApiConfig.baseUrl);
  url.searchParams.set('rankBy', rankingMode);
  url.searchParams.set('size', 9);
  url.searchParams.set('output', '*');
  url.searchParams.set('sid', 'istex-dl');

  // If the query string is too long some browsers won't accept to send a GET request so we send a POST request
  // instead and pass the query string in the body
  if (isQueryStringTooLong(queryString)) {
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

  // This attribute is set to open the URL in another tab, this is useful when the user is redirected
  // to the identity federation page so that they don't lose the current ISTEX-DL page
  link.setAttribute('target', '_blank');

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
