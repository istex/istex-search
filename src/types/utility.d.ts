export type ReplaceReturnType<
  T extends (...args: unknown) => unknown,
  TNewReturn,
> = (...args: Parameters<T>) => TNewReturn;

// Recursive version of native keyof
export type KeyOf<T> = {
  [K in keyof T & (string | number)]: T[K] extends object
    ? `${K}` | `${K}.${KeyOf<T[K]>}`
    : `${K}`;
}[keyof T & (string | number)];

// Partial but with some properties required, taken from here
// https://github.com/microsoft/TypeScript/issues/25760#issuecomment-1708345776
type PartialExcept<T, K extends keyof T> = Pick<Required<T>, K> & Partial<T>;
