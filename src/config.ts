import { isValidDoi, isValidArk, isValidIstexId } from "./lib/utils";

export const istexApiConfig = {
  baseUrl: "https://api.istex.fr",
  maxSize: 100_000,
  maxPaginationOffset: 10_000,
  queryStringMaxLength: 2_000,
  defaultFields: [
    "corpusName",
    "title",
    "doi",
    "accessCondition.contentType",
    "fulltextUrl",
    "host.title",
    "host.genre",
    "author",
    "abstract",
    "genre",
    "publicationDate",
    "arkIstex",
    "fulltext",
    "metadata",
    "annexes",
    "enrichments",
  ],
} as const;

export const corpusWithExternalFulltextLink = [
  "oa-plos",
  "open-edition-journals",
] as const;

export const examples = {
  emmanuelKant:
    'subject.value:("Immanuel Kant" OR "Emmanuel Kant") OR (Aufklärung AND "Immanuel Kant") NOT genre.raw:("book-reviews" OR other OR editorial OR "brief-communication")',
  jeanZayCannesFestival: '"Jean Zay" AND "Festival de Cannes"',
  diegoVelazquez:
    '("Diego Rodríguez de Silva y Velázquez" OR "Diego Velázquez" OR "Diego Vélasquez") AND (tableau* OR painting) NOT arkIstex.raw:("ark:/67375/GFS-RHFDF4SC-S" OR "ark:/67375/WNG-486PXL65-6" OR "ark:/67375/6H6-K60DW670-X" OR "ark:/67375/C41-MCK77ZB6-9" OR "ark:/67375/JKT-DQXSSJ89-1" OR "ark:/67375/GFS-QB9B5SB9-C")',
  alienorAquitaine:
    '"Aliénor d\'Aquitaine" AND ("Louis VII" OR "Henri II") NOT genre.raw:other',
  uefaEuro:
    'title:(uefa OR euro) AND (football OR soccer) NOT ("champions league" OR "ligue des champions" OR "europa league" OR "ligue europa") AND title.raw:/.*[0-9].*/ NOT (" ark:/67375/6H6-2S3V4H7Q-3" " ark:/67375/G14-FM5D3LZN-K"" ark:/67375/WNG-VP5GQ3GB-1" "ark:/67375/6GQ-5CZ9XSTV-5" "ark:/67375/6GQ-TCQLNC54-X")',
  normandyLandings:
    '("Débarquement de Normandie" "Debarquement de Normandie" "Normandy landing" "Normandy landings") AND 1944',
} as const;

export const perPageOptions = [10, 20, 30] as const;
export const MIN_PER_PAGE = perPageOptions[0];
export const MAX_PER_PAGE = perPageOptions[2];
export type PerPageOption = (typeof perPageOptions)[number];

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
export const NO_FORMAT_SELECTED = 0;
export type FormatCategoryName = keyof typeof formats;

export const archiveTypes = ["zip", "tar"] as const;
export const DEFAULT_ARCHIVE_TYPE = archiveTypes[0];
export type ArchiveType = (typeof archiveTypes)[number];

export const compressionLevels = [0, 6, 9] as const;
export const DEFAULT_COMPRESSION_LEVEL = compressionLevels[1];
export type CompressionLevel = (typeof compressionLevels)[number];

export const usages = {
  custom: {
    isGateway: false,
    url: "https://doc.istex.fr/tdm/annexes/liste-des-formats.html",
    formats: NO_FORMAT_SELECTED,
    archiveTypes,
    column: 0,
    row: 0,
  },
  lodex: {
    isGateway: true,
    url: "https://lodex.inist.fr/",
    formats: formats.metadata.json,
    archiveTypes,
    column: 1,
    row: 0,
  },
  cortext: {
    isGateway: true,
    url: "https://cortext.net/",
    formats:
      formats.fulltext.tei |
      formats.fulltext.cleaned |
      formats.enrichments.teeft,
    archiveTypes: ["zip"],
    column: 2,
    row: 0,
  },
  gargantext: {
    isGateway: true,
    url: "https://gargantext.org/",
    formats: formats.metadata.json,
    archiveTypes: ["zip"],
    column: 1,
    row: 3,
  },
} as const;
export type UsageName = keyof typeof usages;
export const DEFAULT_USAGE_NAME: UsageName = "custom";

export const rankValues = ["qualityOverRelevance", "random"] as const;
export const sortFields = ["publicationDate", "title.raw"] as const;
export const DEFAULT_SORT_BY = rankValues[0];
export type SortBy = (typeof sortFields)[number] | (typeof rankValues)[number];

export const sortDir = ["asc", "desc"] as const;
export const DEFAULT_SORT_DIR = sortDir[0];
export type SortDir = (typeof sortDir)[number];

export const searchModes = ["regular", "assisted", "import"] as const;
export const SEARCH_MODE_REGULAR = searchModes[0];
export const SEARCH_MODE_ASSISTED = searchModes[1];
export const SEARCH_MODE_IMPORT = searchModes[2];
export type SearchMode = (typeof searchModes)[number];

export const supportedIdTypes = [
  {
    typeName: "doi",
    fieldName: "doi.raw",
    corpusFilePrefix: "doi",
    isValidId: isValidDoi,
  },
  {
    typeName: "ark",
    fieldName: "arkIstex.raw",
    corpusFilePrefix: "ark",
    isValidId: isValidArk,
  },
  {
    typeName: "istexId",
    fieldName: "id",
    corpusFilePrefix: "id",
    isValidId: isValidIstexId,
  },
] as const;
export type SupportedIdType = (typeof supportedIdTypes)[number];

// Maybe find a better way to estimate the archive size one day (or give up on trying)...
export const formatSizes = {
  baseSizes: {
    fulltext: {
      pdf: 1834832, // ~1.75 MB
      tei: 126311, // ~123.3 KB
      txt: 80585, // ~78.7 KB
      cleaned: 53569, // ~52.3 KB
      zip: 2123192, // ~2.02 MB
      tiff: 6685424, // ~6.38 MB
    },
    metadata: {
      json: 14812, // ~14.5 KB
      xml: 159401, // ~155.7 KB
      mods: 22108, // ~21.6 KB
    },
    enrichments: {
      multicat: 8644, // ~8.4 KB
      nb: 6949, // ~6.8 KB
      grobidFulltext: 61730, // ~60.3 KB
      refBibs: 28699, // ~28 KB
      teeft: 40890, // ~39.9 KB
      unitex: 32609, // ~31.8 KB
    },
    others: {
      covers: 1585080, // ~1.51 MB
      annexes: 7268606, // ~6.93 MB
    },
  },
  [archiveTypes[0]]: {
    multipliers: {
      [compressionLevels[0]]: {
        fulltext: {
          pdf: 0.99,
          tei: 0.93,
          txt: 0.89,
          cleaned: 0.87,
          zip: 1,
          tiff: 1,
        },
        metadata: {
          json: 0.63,
          xml: 0.74,
          mods: 0.66,
        },
        enrichments: {
          multicat: 0.53,
          nb: 0.43,
          grobidFulltext: 0.93,
          refBibs: 0.77,
          teeft: 0.87,
          unitex: 0.8,
        },
        others: {
          covers: 0.94,
          annexes: 0.98,
        },
      },
      [compressionLevels[1]]: {
        fulltext: {
          pdf: 0.88,
          tei: 0.3,
          txt: 0.38,
          cleaned: 0.34,
          zip: 0.85,
          tiff: 0.96,
        },
        metadata: {
          json: 0.25,
          xml: 0.23,
          mods: 0.21,
        },
        enrichments: {
          multicat: 0.22,
          nb: 0.22,
          grobidFulltext: 0.29,
          refBibs: 0.17,
          teeft: 0.09,
          unitex: 0.09,
        },
        others: {
          covers: 0.87,
          annexes: 0.7,
        },
      },
      [compressionLevels[2]]: {
        fulltext: {
          pdf: 0.88,
          tei: 0.3,
          txt: 0.38,
          cleaned: 0.34,
          zip: 0.84,
          tiff: 0.98,
        },
        metadata: {
          json: 0.25,
          xml: 0.24,
          mods: 0.21,
        },
        enrichments: {
          multicat: 0.22,
          nb: 0.22,
          grobidFulltext: 0.3,
          refBibs: 0.17,
          teeft: 0.09,
          unitex: 0.09,
        },
        others: {
          covers: 0.87,
          annexes: 0.7,
        },
      },
    },
  },
  [archiveTypes[1]]: {
    multipliers: {
      [compressionLevels[0]]: {
        fulltext: {
          pdf: 0.97,
          tei: 0.94,
          txt: 0.91,
          cleaned: 0.89,
          zip: 1.01,
          tiff: 1.07,
        },
        metadata: {
          json: 0.69,
          xml: 0.82,
          mods: 0.73,
        },
        enrichments: {
          multicat: 0.6,
          nb: 0.52,
          grobidFulltext: 1,
          refBibs: 0.8,
          teeft: 0.89,
          unitex: 0.83,
        },
        others: {
          covers: 0.97,
          annexes: 0.99,
        },
      },
      [compressionLevels[1]]: {
        fulltext: {
          pdf: 0.9,
          tei: 0.29,
          txt: 0.37,
          cleaned: 0.33,
          zip: 0.85,
          tiff: 0.98,
        },
        metadata: {
          json: 0.19,
          xml: 0.19,
          mods: 0.12,
        },
        enrichments: {
          multicat: 0.04,
          nb: 0.04,
          grobidFulltext: 0.27,
          refBibs: 0.14,
          teeft: 0.05,
          unitex: 0.05,
        },
        others: {
          covers: 0.86,
          annexes: 0.7,
        },
      },
      [compressionLevels[2]]: {
        fulltext: {
          pdf: 0.88,
          tei: 0.28,
          txt: 0.37,
          cleaned: 0.33,
          zip: 0.88,
          tiff: 0.96,
        },
        metadata: {
          json: 0.19,
          xml: 0.19,
          mods: 0.12,
        },
        enrichments: {
          multicat: 0.04,
          nb: 0.04,
          grobidFulltext: 0.27,
          refBibs: 0.14,
          teeft: 0.05,
          unitex: 0.05,
        },
        others: {
          covers: 0.86,
          annexes: 0.7,
        },
      },
    },
  },
} as const;

export const ARCHIVE_SIZE_THRESHOLD_WARNING = 1;
export const ARCHIVE_SIZE_THRESHOLD_ERROR = 6;
