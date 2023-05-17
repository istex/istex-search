import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import type { URLSearchParams } from 'url';

export type GenerateMetadata<T> = (props: {
  params: T;
  searchParams: URLSearchParams;
}) => Promise<Metadata>;

// A client component is a regular React component that can take children
export type ClientComponent<TProps = unknown> = React.FC<PropsWithChildren<TProps>>;

// A server component is just like a client component but can either return what a
// client component usually returns or a Promise to what a client component usually returns.
// Here, `_RetType` is a private generic only used crate a type alias, it is not meant to be
// used when instanciating a server component.
export type ServerComponent<TProps = unknown, _RetType = ReturnType<ClientComponent<TProps>>> =
  ReplaceReturnType<ClientComponent<TProps>, _RetType | Promise<_RetType>>;

export type Page = ServerComponent;

export type DynamicRoutePage<T> = ServerComponent<{ params: T; }>;

export type Layout = RequiredChildrenFC;

/**
 * Utility types
 */

type ReplaceReturnType<T extends (...args: any) => any, TNewReturn> =
  (...args: Parameters<T>) => TNewReturn;

type RequiredChildrenFC<T = unknown> = React.FC<Required<PropsWithChildren<T>>>;
