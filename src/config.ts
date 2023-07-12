export type Usage = (typeof usages)[number];

export const usages = [
  {
    name: "custom",
    isGateway: false,
    url: "https://doc.istex.fr/tdm/annexes/liste-des-formats.html",
  },
  {
    name: "lodex",
    isGateway: true,
    url: "https://lodex.inist.fr/",
  },
  {
    name: "cortext",
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
