export type Usage = (typeof usages)[number];

export const usages = [
  {
    name: "lodex",
    label: "lodex.label",
    isGateway: true,
    url: "https://lodex.inist.fr/",
  },
  {
    name: "cortext",
    label: "cortext.label",
    isGateway: true,
    url: "https://cortext.net/",
  },
] as const;

export type QueryMode = (typeof queryModes)[number];

export const queryModes = [
  {
    name: "search",
  },
] as const;

export const istexApiConfig = {
  baseUrl: "https://api.istex.fr",
} as const;
