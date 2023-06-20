import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import type { URLSearchParams } from "url";
import type { ReplaceReturnType } from "./utility";

export type GenerateMetadata<T = Record<string, never>> = (props: {
  params: T;
  searchParams: URLSearchParams;
}) => Promise<Metadata>;

export type ClientComponent<TProps = unknown, WithChildren = false> = React.FC<
  WithChildren extends true ? Required<PropsWithChildren<TProps>> : TProps
>;

// A ServerComponent is just like a ClientComponent but can either return what a
// ClientComponent usually returns or a Promise to what a ClientComponent usually returns.
// Here, `_RetType` is a private generic only used to create a type alias, it is not meant
// to be used when instanciating a server component.
export type ServerComponent<
  TProps = unknown,
  WithChildren = false,
  _RetType = ReturnType<ClientComponent<TProps, WithChildren>>
> = ReplaceReturnType<
  ClientComponent<TProps, WithChildren>,
  _RetType | Promise<_RetType>
>;

// A Page is a ServerComponent that does take any props (so no children)
export type Page = ServerComponent<never>;

// A DynamicRoutePage is a ServerComponent that takes `params` as props but no children
export type DynamicRoutePage<T> = ServerComponent<{ params: T }>;

// A layout is a normal ServerComponent but children are required
export type Layout = ServerComponent<unknown, true>;
