export const queryModes = {
  modes: ['query string', 'ark', 'file import'],
  getDefault: () => queryModes.modes[0],
};

const rankingModes = {
  modes: ['qualityOverRelevance', 'relevance', 'random'],
  getDefault: () => rankingModes.modes[0],
};

const archiveTypes = {
  types: ['zip', 'tar'],
  getDefault: () => archiveTypes.types[0],
};

const compressionLevels = {
  levels: [
    { value: 0, label: 'No compression' },
    { value: 6, label: 'Medium compression' },
    { value: 9, label: 'High compression' },
  ],
  getDefault: () => compressionLevels.levels[1],
};

export const istexApiConfig = {
  baseUrl: 'https://api.istex.fr',
  rankingModes,
  archiveTypes,
  compressionLevels,
  maxAmountOfDocuments: 100000,
  queryStringMaxLength: 2000,
};

// The selected formats are stored in an integer divided in five sections,
// the first three represent format categories and are 10 bits long. The last
// 2 bits are used for covers and annexes. The highest possible value we can
// use is 1 << 31 because JavaScript converts numbers (which are floating point
// numbers internally) to 32-bit signed integers when using bitwise operators.
//
// The bits of this integerer follow this layout:
//
// | annexes | covers |  enrichments  |   metadata   |   fulltext    |
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
  covers: 1 << 30,
  annexes: 1 << 31,
};

export const usages = {
  customUsage: {
    selectedFormats: 0,
  },
  lodex: {
    selectedFormats: formats.metadata.json,
  },
};

// TODO: get more accurate numbers (or find a better way to estimate the archive size...)
export const formatSizes = {
  baseSizes: {
    fulltext: {
      pdf: 2 * 1024 * 1024, // 2 MB
      tei: 12 * 1024, // 12 KB
      txt: 11 * 1024, // 11 KB
      cleaned: 11 * 1024, // 11 KB
      zip: 6 * 1024 * 1024, // 6 MB
      tiff: 24 * 1024 * 1024, // 24 MB
    },
    metadata: {
      json: 7 * 1024, // 7 KB
      xml: 3 * 1024, // 3 KB
      mods: 3 * 1024, // 3 KB
    },
    enrichments: {
      multicat: 2 * 1024, // 2 KB
      nb: 2 * 1024, // 2 KB
      grobidFulltext: 12 * 1024, // 12 KB
      refBibs: 1 * 1024, // 1 KB
      teeft: 2 * 1024, // 2 KB
      unitex: 1 * 1024, // 1 KB
    },
    covers: 1 * 1024, // 1 KB
    annexes: 6 * 1024 * 1024, // 6 MB
  },
  multipliers: {
    [compressionLevels.levels[0].value]: {
      fulltext: {
        pdf: 1,
        tei: 1,
        txt: 1,
        cleaned: 1,
        zip: 1,
        tiff: 1,
      },
      metadata: {
        json: 1,
        xml: 1,
        mods: 1,
      },
      enrichments: {
        multicat: 1,
        nb: 1,
        grobidFulltext: 1,
        refBibs: 1,
        teeft: 1,
        unitex: 1,
      },
      covers: 1,
      annexes: 1,
    },
    [compressionLevels.levels[1].value]: {
      fulltext: {
        pdf: 0.6,
        tei: 0.6,
        txt: 0.6,
        cleaned: 0.6,
        zip: 0.6,
        tiff: 0.6,
      },
      metadata: {
        json: 0.6,
        xml: 0.6,
        mods: 0.6,
      },
      enrichments: {
        multicat: 0.6,
        nb: 0.6,
        grobidFulltext: 0.6,
        refBibs: 0.6,
        teeft: 0.6,
        unitex: 0.6,
      },
      covers: 0.6,
      annexes: 0.6,
    },
    [compressionLevels.levels[2].value]: {
      fulltext: {
        pdf: 0.3,
        tei: 0.3,
        txt: 0.3,
        cleaned: 0.3,
        zip: 0.3,
        tiff: 0.3,
      },
      metadata: {
        json: 0.3,
        xml: 0.3,
        mods: 0.3,
      },
      enrichments: {
        multicat: 0.3,
        nb: 0.3,
        grobidFulltext: 0.3,
        refBibs: 0.3,
        teeft: 0.3,
        unitex: 0.3,
      },
      covers: 0.3,
      annexes: 0.3,
    },
  },
};
