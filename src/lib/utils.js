/**
 * Create a debounced function that delays the call of `callback` until after `delay` milliseconds have elapsed
 * since the debounced function was last called.
 * @param {Function} callback The callback to call.
 * @param {number} delay The delay to wait before calling `callback`.
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
