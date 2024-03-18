import type { Metadata } from "next";
import type { ReplaceReturnType } from "./utility";

export type NextSearchParams = Record<string, string | string[] | undefined>;

export type GenerateMetadata<T extends object = {}> = (props: {
  params: T & { locale: string };
  searchParams: NextSearchParams;
}) => Promise<Metadata>;

export type ClientComponent<
  TProps extends object = {},
  WithChildren = false,
> = React.FC<
  WithChildren extends true ? React.PropsWithChildren<TProps> : TProps
>;

// A ServerComponent is just like a ClientComponent but can either return what a
// ClientComponent usually returns or a Promise to what a ClientComponent usually returns.
// Here, `_RetType` is a private generic only used to create a type alias, it is not meant
// to be used when instanciating a server component.
export type ServerComponent<
  TProps extends object = {},
  WithChildren = false,
  _RetType = ReturnType<ClientComponent<TProps, WithChildren>>,
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
export type Page<T extends object = {}> = ServerComponent<{
  params: T & { locale: string };
  searchParams: NextSearchParams;
}>;

// A Layout is a normal ServerComponent but children are required.
export type Layout<T extends object = {}> = ServerComponent<
  {
    params: T & { locale: string };
  },
  true
>;
