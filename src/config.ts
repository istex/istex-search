import { isValidDoi, isValidArk, isValidIstexId } from "./lib/utils";

export const istexApiConfig = {
  baseUrl: "https://api.istex.fr",
  maxSize: 100_000,
  maxPaginationOffset: 10_000,
  queryStringMaxLength: 2_000,
} as const;

export const examples = {
  climateChange:
    '(title:("climate warming" "réchauffement climatique" "climate change" "climatic change" "changement climatique") abstract:("climate warming" "réchauffement climatique" "climate change" "climatic change" "changement climatique") subject.value:("climate warming" "réchauffement climatique" "climate change" "climatic change" "changement climatique")) AND publicationDate:[1990 TO *]',
  emileDurkheim:
    '(title.raw:/.*([eéEÉ]mile.)?[dD]urkheim.*/ OR author.name.raw:/.*([eéEÉ]mile.)?[dD]urkheim.*/ OR namedEntities.unitex.persName.raw:/.*([eéEÉ]mile.)?[dD]urkheim.*/ OR refBibs.author.name.raw:/.*([eéEÉ]mile.)?[dD]urkheim.*/ NOT doi:"10.1016/0008-6223(84)90184-2")',
  translationAndAI:
    '("traduction automatique" "machine translation") AND language:("fre" "eng") AND (categories.scienceMetrix:"artificial intelligence" OR categories.wos:"artificial intelligence" OR categories.scopus:"artificial intelligence")',
  ephedrineToxicity:
    '(title:(pseudoéphédrine OR pseudoephedrine) OR abstract:(pseudoéphédrine OR pseudoephedrine)) AND (subject.value:(toxicity OR toxicité OR complication OR "secondary effect" OR "effet secondaire") OR (keywords.teeft:(toxicity OR toxicité OR complication OR "secondary effect" OR "effet secondaire")))',
  fridaKahlo:
    '(title:"Frida Kahlo" OR abstract:"Frida Kahlo") AND (Icon* OR icône)',
  normandyLandings:
    '("Débarquement de Normandie""Debarquement de Normandie""Normandy landing") AND 1944',
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

export const usages = {
  custom: {
    isGateway: false,
    url: "https://doc.istex.fr/tdm/annexes/liste-des-formats.html",
    formats: NO_FORMAT_SELECTED,
    column: 0,
    row: 0,
  },
  lodex: {
    isGateway: true,
    url: "https://lodex.inist.fr/",
    formats: formats.metadata.json,
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
    column: 2,
    row: 0,
  },
  gargantext: {
    isGateway: true,
    url: "https://gargantext.org/",
    formats: formats.metadata.json,
    column: 1,
    row: 3,
  },
} as const;
export type UsageName = keyof typeof usages;
export const DEFAULT_USAGE_NAME: UsageName = "custom";

export const rankValues = ["qualityOverRelevance", "random"] as const;
export const sortFields = ["publicationDate", "title.raw"] as const;
const sortDir = ["asc", "desc"] as const;
export const DEFAULT_SORT_BY = rankValues[0];
export const DEFAULT_SORT_DIR = sortDir[0];
export type SortBy = (typeof sortFields)[number] | (typeof rankValues)[number];
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
