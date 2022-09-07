export const queryModes = {
  modes: [
    { value: 'queryString', label: 'Équation booléenne' },
    { value: 'ark', label: 'Identifiants ARK' },
    { value: 'fileImport', label: 'Import de fichier' },
    { value: 'queryAssist', label: 'Recherche assistée' },
  ],
  getDefault: () => queryModes.modes[0],
};

const rankingModes = {
  modes: [
    { value: 'qualityOverRelevance', label: 'Par pertinence & qualité' },
    { value: 'relevance', label: 'Par pertinence' },
    { value: 'random', label: 'Aléatoirement' },
  ],
  getDefault: () => rankingModes.modes[0],
};

const archiveTypes = {
  types: [
    { value: 'zip', label: 'ZIP' },
    { value: 'tar', label: 'TAR.GZ' },
  ],
  getDefault: () => archiveTypes.types[0],
};

const compressionLevels = {
  levels: [
    { value: 0, label: 'Sans compression' },
    { value: 6, label: 'Compression moyenne' },
    { value: 9, label: 'Compression élevée' },
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
    label: 'Texte intégral',
    formats: {
      pdf: {
        label: 'PDF',
        value: 1 << 0,
      },
      tei: {
        label: 'TEI',
        value: 1 << 1,
      },
      txt: {
        label: 'TXT',
        value: 1 << 2,
      },
      cleaned: {
        label: 'CLEANED',
        value: 1 << 3,
      },
      zip: {
        label: 'ZIP',
        value: 1 << 4,
      },
      tiff: {
        label: 'TIFF',
        value: 1 << 5,
      },
    },
  },
  metadata: {
    label: 'Métadonnées',
    formats: {
      json: {
        label: 'JSON',
        value: 1 << 10,
      },
      xml: {
        label: 'XML',
        value: 1 << 11,
      },
      mods: {
        label: 'MODS',
        value: 1 << 12,
      },
    },
  },
  enrichments: {
    label: 'Enrichissements',
    formats: {
      multicat: {
        label: 'multicat',
        value: 1 << 20,
      },
      nb: {
        label: 'nb',
        value: 1 << 21,
      },
      grobidFulltext: {
        label: 'grobidFulltext',
        value: 1 << 22,
      },
      refBibs: {
        label: 'refBibs',
        value: 1 << 23,
      },
      teeft: {
        label: 'teeft',
        value: 1 << 24,
      },
      unitex: {
        label: 'unitex',
        value: 1 << 25,
      },
    },
  },
  covers: {
    label: 'Couvertures',
    value: 1 << 30,
  },
  annexes: {
    label: 'Annexes',
    value: 1 << 31,
  },
};

export const usages = {
  customUsage: {
    label: 'Usage personnalisé',
    selectedFormats: 0,
  },
  lodex: {
    label: 'Lodex',
    selectedFormats: formats.metadata.formats.json.value,
  },
};

export const catalogList = [
  {
    title: 'Souvent utilisé',
    items: [
      {
        dataTitle: 'Tous les champs',
        dataInfo: 'Recherche d\'un ou plusieurs termes dans toute la notice',
      },
      {
        dataTitle: 'Année de publication',
        dataInfo: 'Date de publication papier de l\'article',
      },
    ],
  },
  {
    title: 'Revues',
    items: [
      {
        dataTitle: 'Titre de la revue',
        dataInfo: 'Recherche d\'un ou plusieurs termes dans le titre de la revue',
      },
      {
        dataTitle: 'ISSN',
        dataInfo: 'Numéro ISSN de la revue',
      },
    ],
  },
  {
    title: 'Enrichissements',
    items: [
      {
        dataTitle: 'Lieux géographiques',
        dataInfo: 'Recherche d\'un ou plusieurs termes identifiés dans le texte de l\'article comme étant un lieu géographique',
      },
      {
        dataTitle: 'Catégorie Inist',
        dataInfo: 'Recherche par catégorie scientifique du plan de classement Inist',
      },
    ],
  },
];

// Maybe find a better way to estimate the archive size one day...
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
    covers: 1585080, // ~1.51 MB
    annexes: 7268606, // ~6.93 MB
  },
  [archiveTypes.types[0].value]: {
    multipliers: {
      [compressionLevels.levels[0].value]: {
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
        covers: 0.94,
        annexes: 0.98,
      },
      [compressionLevels.levels[1].value]: {
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
        covers: 0.87,
        annexes: 0.7,
      },
      [compressionLevels.levels[2].value]: {
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
        covers: 0.87,
        annexes: 0.7,
      },
    },
  },
  [archiveTypes.types[1].value]: {
    multipliers: {
      [compressionLevels.levels[0].value]: {
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
        covers: 0.97,
        annexes: 0.99,
      },
      [compressionLevels.levels[1].value]: {
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
        covers: 0.86,
        annexes: 0.7,
      },
      [compressionLevels.levels[2].value]: {
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
        covers: 0.86,
        annexes: 0.7,
      },
    },
  },
};
