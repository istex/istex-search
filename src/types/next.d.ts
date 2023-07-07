import type { Metadata } from "next";
import type { PropsWithRequiredChildren, ReplaceReturnType } from "./utility";

export type NextSearchParams = Record<string, string | string[] | undefined>;

export type GenerateMetadata<T extends object = Record<string, unknown>> =
  (props: {
    params: T & { locale: string };
    searchParams: NextSearchParams;
  }) => Promise<Metadata>;

export type ClientComponent<
  TProps extends object = Record<string, unknown>,
  WithChildren = false
> = React.FC<
  WithChildren extends true ? PropsWithRequiredChildren<TProps> : TProps
>;

// A ServerComponent is just like a ClientComponent but can either return what a
// ClientComponent usually returns or a Promise to what a ClientComponent usually returns.
// Here, `_RetType` is a private generic only used to create a type alias, it is not meant
// to be used when instanciating a server component.
export type ServerComponent<
  TProps extends object = Record<string, unknown>,
  WithChildren = false,
  _RetType = ReturnType<ClientComponent<TProps, WithChildren>>
> = ReplaceReturnType<
  ClientComponent<TProps, WithChildren>,
  _RetType | Promise<_RetType>
>;

// A Page is a ServerComponent that takes an object with the dynamic route parameter (if there
// is one) and the locale but no children.
// Examples:
//   /fr/results/123 => { params: { id: "123", locale: "fr" }}
//   /fr/results     => { params: { locale: "fr" }}
//   /results        => { params: { locale: "fr" }} (locale is implicit here)
export type Page<T extends object = Record<string, unknown>> = ServerComponent<{
  params: T & { locale: string };
  searchParams: NextSearchParams;
}>;

// A Layout is a normal ServerComponent but children are required.
export type Layout<T extends object = Record<string, unknown>> =
  ServerComponent<T, true>;
