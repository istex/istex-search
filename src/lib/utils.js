import { buildExtractParamsFromFormats } from './formats';

/**
 * Checks if `hash` is a valid md5 hash.
 * @param {string} hash The hash to check.
 * @returns `true` if `hash` is a valid md5 hash, `false` otherwise.
 */
export function isValidMd5 (hash) {
  if (typeof hash !== 'string') return false;

  return (/^[a-f0-9]{32}$/g).test(hash);
}

/**
 * Check if `doi` is a valid DOI.
 * @param {string} doi The DOI to check.
 * @returns `true` if `doi` is a valid DOI, `false` otherwise.
 */
export function isValidDoi (doi) {
  if (typeof doi !== 'string') return false;

  return (/\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&'])\S)+)\b/gi).test(doi);
}

/**
 * Debounce `callback` after `delay`.
 * @param {function} callback The callback to debounce.
 * @param {number} delay The delay to wait before calling `callback`.
 * @returns A function that will call its callback only if `delay` has passed since the last time it was called.
 */
export function debounce (callback, delay = 1000) {
  let timeoutId;

  const debounced = (...args) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      // eslint-disable-next-line n/no-callback-literal
      callback(...args);
    }, delay);
  };

  debounced.cancel = () => {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  };

  return debounced;
}

/**
 * Debounce `callback` after delay. The returned function returns a `Promise`.
 * @param {function} callback The asynchronous callback (must return a `Promise`).
 * @param {number} delay The delay to wait before calling `callback`.
 * @returns A function that will call its callback only if `delay` has passed since the last time it was called.
 *          This function returns a `Promise` that will resolve when the `Promise` returned by its callback resolves.
 */
export function asyncDebounce (callback, delay = 1000) {
  const debounced = debounce(async (resolve, reject, args) => {
    try {
      // eslint-disable-next-line n/no-callback-literal
      const result = await callback(...args);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  }, delay);

  const asyncDebounced = (...args) => {
    return new Promise((resolve, reject) => {
      debounced(resolve, reject, args);
    });
  };

  asyncDebounced.cancel = debounced.cancel;

  return asyncDebounced;
}

export function buildFullIstexDlUrl ({ queryString, qId, selectedFormats, rankingMode, numberOfDocuments, compressionLevel, archiveType, usage }) {
  // If no format is selected, return early and don't add the extract parameter
  if (!selectedFormats) return null;

  const extractParams = buildExtractParamsFromFormats(selectedFormats);

  // Build the final URL object
  const url = new URL(window.location.href);

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
  url.searchParams.set('usage', usage);

  return url;
}
