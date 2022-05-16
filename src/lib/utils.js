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
 * Debounce `callback` after `delay`.
 * @param {function} callback The callback to debounce.
 * @param {number} delay The delay to wait before calling `callback`.
 * @returns A function that will call its callback only if `delay` has passed since the last time it was called.
 */
export function debounce (callback, delay = 1000) {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      // eslint-disable-next-line node/no-callback-literal
      callback(...args);
    }, delay);
  };
}
