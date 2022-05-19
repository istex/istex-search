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
      // eslint-disable-next-line node/no-callback-literal
      const result = await callback(...args);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  }, delay);

  return (...args) => {
    return new Promise((resolve, reject) => {
      debounced(resolve, reject, args);
    });
  };
}
