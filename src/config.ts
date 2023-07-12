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

// The selected formats are stored in an integer divided in five sections,
// the first three represent format categories and are 10 bits long. The last
// 2 bits are used for covers and annexes. The highest possible value we can
// use is 1 << 31 because JavaScript converts numbers (which are floating point
// numbers internally) to 32-bit signed integers when using bitwise operators.
//
// The bits of this integerer follow this layout:
//
// | covers | annexes |  enrichments  |   metadata   |   fulltext    |
//      0        0       0000000000      0000000000     0000000000
export const formats = {
  fulltext: {
    pdf: 1 << 0,
    tei: 1 << 1,
    txt: 1 << 2,
    cleaned: 1 << 3,
    zip: 1 << 4,
    tiff: 1 << 5,
  },
  metadata: {
    json: 1 << 10,
    xml: 1 << 11,
    mods: 1 << 12,
  },
  annexes: 1 << 30,
  covers: 1 << 31,
  enrichments: {
    multicat: 1 << 20,
    nb: 1 << 21,
    grobidFulltext: 1 << 22,
    refBibs: 1 << 23,
    teeft: 1 << 24,
    unitex: 1 << 25,
  },
} as const;
