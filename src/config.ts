// TODO: Refactor the usage structure to be like the query modes (array of readonly keys)

export interface Usage {
  name: "lodex" | "cortext";
  label: string;
  isGateway: boolean;
  url: string;
}

export const usages: Usage[] = [
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
];

export type QueryMode = (typeof queryModes)[number];

export const queryModes = [
  {
    name: "search",
  },
] as const;
