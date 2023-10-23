export type QueryMode = keyof typeof queryModes;
export const DEFAULT_QUERY_MODE: QueryMode = "search";

export const queryModes = {
  search: {},
  import: {},
} as const;

export const istexApiConfig = {
  baseUrl: "https://api.istex.fr",
  maxSize: 100_000,
  maxPaginationOffset: 10_000,
} as const;

export type PerPageOption = (typeof perPageOptions)[number];
export const perPageOptions = [10, 20, 30] as const;
export const MIN_PER_PAGE = perPageOptions[0];
export const MAX_PER_PAGE = perPageOptions[2];

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

export type FormatCategoryName = keyof typeof formats;
export const NO_FORMAT_SELECTED = 0;

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
  enrichments: {
    multicat: 1 << 20,
    nb: 1 << 21,
    grobidFulltext: 1 << 22,
    refBibs: 1 << 23,
    teeft: 1 << 24,
    unitex: 1 << 25,
  },
  others: {
    annexes: 1 << 30,
    covers: 1 << 31,
  },
} as const;

export type UsageName = keyof typeof usages;
export const DEFAULT_USAGE_NAME: UsageName = "custom";

export const usages = {
  custom: {
    isGateway: false,
    url: "https://doc.istex.fr/tdm/annexes/liste-des-formats.html",
    formats: NO_FORMAT_SELECTED,
  },
  lodex: {
    isGateway: true,
    url: "https://lodex.inist.fr/",
    formats: formats.metadata.json,
  },
  cortext: {
    isGateway: true,
    url: "https://cortext.net/",
    formats:
      formats.fulltext.tei |
      formats.fulltext.cleaned |
      formats.enrichments.teeft,
  },
  gargantext: {
    isGateway: true,
    url: "https://gargantext.org/",
    formats: formats.metadata.json,
  },
} as const;
