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
  annexes: {
    label: 'Annexes',
    value: 1 << 31,
  },
  covers: {
    label: 'Couvertures',
    value: 1 << 30,
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
};

export const usages = {
  customUsage: {
    label: 'Usage personnalisé',
    description: '',
    selectedFormats: 0,
    tags: ['DOC', 'TDM'],
  },
  lodex: {
    label: 'Lodex',
    description: 'Analyse graphique / Exploration de corpus',
    selectedFormats: formats.metadata.formats.json.value,
    tags: ['TDM'],
  },
  cortext: {
    label: 'CorText',
    description: 'Plateforme d\'outils / Analyse multidimensionnelle',
    selectedFormats: formats.fulltext.formats.tei.value |
      formats.fulltext.formats.cleaned.value |
      formats.enrichments.formats.teeft.value,
    tags: ['TDM'],
  },
};

export const operatorsRequest = [
  { value: 'AND', label: 'ET' },
  { value: 'OR', label: 'OU' },
  { value: 'NOT', label: 'SAUF' },
];

export const operatorsField = [
  { id: 'is_equal', label: 'égal' },
  { id: 'is_not_equal', label: 'non égal' },
  { id: 'is_empty', label: 'est vide' },
  { id: 'is_not_empty', label: "n'est pas vide" },
  { id: 'is_more_than', label: 'supérieur' },
  { id: 'is_less_than', label: 'inférieur' },
  { id: 'is_between', label: 'est entre' },
  { id: 'is_not_between', label: "n'est pas entre" },
];

export const catalogList = [
  {
    title: 'Souvent utilisés',
    items: [
      {
        dataTitle: 'Tous champs',
        dataInfo: 'Recherche sur tous champs confondus',
        dataValue: '',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'Titre',
        dataInfo: 'Recherche sur le titre de l\'article ou du chapitre de livre',
        dataValue: 'title',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'Résumé',
        dataInfo: 'Recherche sur le résumé de l\'article ou du chapitre de livre',
        dataValue: 'abstract',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
    ],
  },
  {
    title: 'Articles ou Chapitres',
    items: [
      {
        dataTitle: 'Titre',
        dataInfo: 'Titre du document',
        dataValue: 'title',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'Nom d\'auteur',
        dataInfo: 'Noms des auteurs du document',
        dataValue: 'author.name',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'Résumé',
        dataInfo: 'résumé du document',
        dataValue: 'abstract',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'Texte intégral',
        dataInfo: 'corps du texte - restreint aux documents nettoyés',
        dataValue: 'qualityIndicators.tdmReady:true AND fulltext', // dirty hack
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'DOI',
        dataInfo: 'identifiant DOI du document',
        dataValue: 'doi',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'Langue',
        dataInfo: 'langue de publication',
        dataValue: 'language',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'Année de publication',
        dataInfo: 'date de publication papier',
        dataValue: 'publicationDate',
        operatorsField: [
          { id: 'is_equal', typeField: 'date' },
          { id: 'is_between', typeField: 'range' },
        ],
      },
    ],
  },
  {
    title: 'Mots-clés',
    items: [
      {
        dataTitle: 'Mot-clé d\'auteur',
        dataInfo: 'mots-clés attribués par les auteurs',
        dataValue: 'subject.value',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'Mot-clé Teeft',
        dataInfo: 'mots-clés extraits du texte par Teeft',
        dataValue: 'keywords.teeft',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
    ],
  },
  {
    title: 'Catégories scientifiques',
    items: [
      {
        dataTitle: 'Catégorie Inist',
        dataInfo: 'catégorie du plan de classement Inist',
        dataValue: 'categories.inist',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'Catégorie Scopus',
        dataInfo: 'catégorie de la classification Scopus',
        dataValue: 'categories.scopus',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'Catégorie Science-Metrix',
        dataInfo: 'catégorie de la classification Science-Metrix',
        dataValue: 'categories.scienceMetrix',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'Catégorie WoS',
        dataInfo: 'catégorie de la classification Web of Science',
        dataValue: 'categories.wos',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
    ],
  },
  {
    title: 'Entités nommées',
    items: [
      {
        dataTitle: 'Date',
        dataInfo: 'date détectée dans le texte',
        dataValue: 'namedEntities.unitex.date',
        operatorsField: [
          { id: 'is_equal', typeField: 'date' },
          { id: 'is_between', typeField: 'range' },
        ],
      },
      {
        dataTitle: 'Lieu administratif',
        dataInfo: 'nom de lieu géopolitique ou administratif détecté dans le texte',
        dataValue: 'namedEntities.unitex.placeName',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'Lieu géographique',
        dataInfo: 'nom de lieu comportant une caractéristique géographique détecté dans le texte',
        dataValue: 'namedEntities.unitex.geogName',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'Personne',
        dataInfo: 'nom de personne détecté dans le texte',
        dataValue: 'namedEntities.unitex.persName',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
    ],
  },
  {
    title: 'Revues ou Monographies',
    items: [
      {
        dataTitle: 'Titre',
        dataInfo: 'Titre de la revue ou monographie',
        dataValue: 'host.title',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'ISSN',
        dataInfo: 'Numéro ISSN de la revue papier',
        dataValue: 'host.issn',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'e-ISSN',
        dataInfo: 'Numéro ISSN de la revue électronique',
        dataValue: 'host.eissn',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'ISBN',
        dataInfo: 'Numéro ISBN de la monographie papier',
        dataValue: 'host.isbn',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'e-ISBN',
        dataInfo: 'Numéro ISBN de la monographie électronique',
        dataValue: 'host.eisbn',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'DOI',
        dataInfo: 'identifiant DOI de la revue',
        dataValue: 'host.doi',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
    ],
  },
  {
    title: 'Séries de monographies',
    items: [
      {
        dataTitle: 'Titre de la série',
        dataInfo: 'Titre de la série',
        dataValue: 'serie.title',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'Issn de la série',
        dataInfo: 'Numéro ISSN de la série papier',
        dataValue: 'serie.issn',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'e-Issn de la série',
        dataInfo: 'Numéro ISSN de la série électronique',
        dataValue: 'serie.eissn',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'DOI de la série',
        dataInfo: 'identifiant DOI de la série',
        dataValue: 'serie.doi',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
    ],
  },
  {
    title: 'Références bibliographiques',
    items: [
      {
        dataTitle: 'Noms d\'auteur',
        dataInfo: 'Noms d\'auteur du document référencé',
        dataValue: 'rebBibs.author.name',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'Date de publication',
        dataInfo: 'Date de publication du document référencé',
        dataValue: 'refBibs.publicationDate',
        operatorsField: [
          { id: 'is_equal', typeField: 'date' },
          { id: 'is_between', typeField: 'range' },
        ],
      },
      {
        dataTitle: 'Titre article',
        dataInfo: 'Titre du document référencé',
        dataValue: 'refBibs.title',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'DOI',
        dataInfo: 'DOI du document référencé',
        dataValue: 'refBibs.doi',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
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
