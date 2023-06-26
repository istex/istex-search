export type ReplaceReturnType<T extends (...args: any) => any, TNewReturn> = (
  ...args: Parameters<T>
) => TNewReturn;

// Recursive version of native keyof
export type KeyOf<T> = {
  [K in keyof T & (string | number)]: T[K] extends object
    ? `${K}` | `${K}.${KeyOf<T[K]>}`
    : `${K}`;
}[keyof T & (string | number)];

// Exactly like PropsWithChildren from React but children are not optional
export type PropsWithRequiredChildren<P = unknown> = P & {
  children: React.ReactNode;
};
