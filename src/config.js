export const queryModes = ['query string', 'ark', 'file import'];

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

export const predefinedUsages = {
  lodex: {
    selectedFormats: formats.metadata.json,
  },
};
