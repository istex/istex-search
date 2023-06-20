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
