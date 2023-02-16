import { isValidArk, isValidIstexId, isValidDoi } from '@/lib/utils';

export const queryModes = {
  modes: [
    { value: 'queryString', label: 'Équation booléenne' },
    { value: 'ids', label: 'Liste d\'identifiants' },
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

export const supportedIdTypes = {
  doi: {
    fieldName: 'doi.raw',
    label: 'DOI',
    corpusFilePrefix: 'doi',
    examples: ['10.1007/BF03174889', '10.3917/aco.031.106'],
    isValidId: isValidDoi,
  },
  ark: {
    fieldName: 'arkIstex.raw',
    label: 'ARK',
    corpusFilePrefix: 'ark',
    examples: ['ark:/67375/1BB-Z9XR1RHS-K', 'ark:/67375/B18-2M4TSK1X-8'],
    isValidId: isValidArk,
  },
  istexId: {
    fieldName: 'id',
    label: 'ID Istex',
    corpusFilePrefix: 'id',
    examples: ['5505F878CE216B164009A349AFB608097F029661', '08DB6904B877C25BC961552D9E089BA757D98449'],
    isValidId: isValidIstexId,
  },
};

export const examples = [
  {
    label: 'des troncatures sur des termes de recherche en français et en anglais',
    queryString: 'orthophon* OR logothérap* OR logotherap*',
  },
  {
    label: 'des opérateurs booléens imbriqués',
    queryString: '(species AND ("plant taxonomy" OR  phytogeograph*)) NOT ((fungi fungus) NOT mycorrhiz*)',
  },
  {
    label: 'des données bibliographiques',
    queryString: '(host.issn:"0922-6435" OR host.title:"Journal of Geophysical Research") AND publicationDate:2003 AND genre:("research-article" OR “review article”)',
  },
  {
    label: 'des indicateurs de qualité',
    queryString: '"deep learning" AND qualityIndicators.pdfVersion:[1.3 TO 1.5] AND qualityIndicators.score:[3.5 TO *]',
  },
  {
    label: 'des expressions régulières sur des termes de recherche',
    queryString: '/es(k|qu)im(o|au)[sx]?/ OR  /inuit(s)?/',
  },
  {
    label: 'de la recherche floue et des opérateurs de proximité',
    queryString: '(african~1 + arctic~1) AND "past climate"~2',
  },
  {
    label: 'des enrichissements de type catégorie scientifique',
    queryString: 'categories.scienceMetrix:"astronomy & astrophysics" OR categories.scopus:"astronomy and astrophysics" OR categories.wos:"astronomy & astrophysics" OR categories.inist:"astronomy"',
  },
  {
    label: 'des enrichissements de type entité nommée',
    queryString: 'namedEntities.unitex.persName:beethoven AND namedEntities.unitex.placeName:vienna AND namedEntities.unitex.date:"eighteenth century"',
  },
  {
    label: 'des enrichissements de type terme d’indexation',
    queryString: 'keywords.teeft:coronavirus*',
  },
  {
    label: 'des identifiants Istex de type ARK',
    queryString: 'arkIstex.raw:("ark:/67375/HXZ-3PZ5S1MB-7" "ark:/67375/HXZ-XH6SRM66-7" "ark:/67375/6H6-K00Q3697-8" "ark:/67375/6H6-52QRK0X3-F" "ark:/67375/HXZ-H5NSV5QF-M" "ark:/67375/HXZ-J1BLQKH4-3" "ark:/67375/HXZ-QVSXSCHW-P" "ark:/67375/HXZ-RVC4D13J-W" "ark:/67375/6H6-19QHR7H2-6" "ark:/67375/HXZ-0F8518D4-K" "ark:/67375/6H6-9Q9HLC0X-7" "ark:/67375/6H6-QTZPZZXD-H")',
  },
];

export const operatorsRequest = [
  { value: 'AND', label: 'ET' },
  { value: 'OR', label: 'OU' },
  { value: 'NOT', label: 'SAUF' },
];

export const operatorsField = [
  { id: 'is_equal', label: 'est égale à' },
  { id: 'is_not_equal', label: 'n\'est pas égale à' },
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
        dataTitle: 'Mot-clé d\'auteur',
        dataInfo: 'Recherche par l\'un des mots-clés attribués à l\'article ou au chapitre de livre',
        dataValue: 'subject.value',
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
      {
        dataTitle: 'DOI',
        dataInfo: 'Recherche par identifiant DOI de l\'article ou du chapitre de livre',
        dataValue: 'doi',
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
        dataInfo: 'Recherche sur le titre du document',
        dataValue: 'title',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'Nom d\'auteur',
        dataInfo: 'Recherche par l\'un des auteurs',
        dataValue: 'author.name',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'Résumé',
        dataInfo: 'Recherche sur le résumé du document',
        dataValue: 'abstract',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'Texte intégral',
        dataInfo: 'Recherche sur le corps du texte - restreint aux documents nettoyés',
        dataValue: 'qualityIndicators.tdmReady:true AND fulltext', // dirty hack => find a better way to add constraints
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'DOI',
        dataInfo: 'Recherche par identifiant DOI du document',
        dataValue: 'doi',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'Langue',
        dataInfo: 'Recherche par langue de publication',
        dataValue: 'language',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'Année de publication',
        dataInfo: 'Recherche par date de publication papier',
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
        dataInfo: 'Recherche par l\'un des mots-clés attribués au document par les auteurs',
        dataValue: 'subject.value',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'Mot-clé Teeft',
        dataInfo: 'Recherche par l\'un des mots-clés extraits du texte intégral par l\'outil Teeft (Terms Extraction for English Full Texts)',
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
        dataInfo: 'Recherche par catégorie du plan de classement Inist',
        dataValue: 'categories.inist',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'Catégorie Scopus',
        dataInfo: 'Recherche par catégorie de la classification Scopus',
        dataValue: 'categories.scopus',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'Catégorie Science-Metrix',
        dataInfo: 'Recherche par catégorie de la classification Science-Metrix',
        dataValue: 'categories.scienceMetrix',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'Catégorie WoS',
        dataInfo: 'Recherche par catégorie de la classification Web of Science',
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
        dataInfo: 'Recherche par date détectée dans le texte',
        dataValue: 'namedEntities.unitex.date',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'Lieu administratif',
        dataInfo: 'Recherche par nom de lieu, géopolitique ou administratif, détecté dans le texte',
        dataValue: 'namedEntities.unitex.placeName',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'Lieu géographique',
        dataInfo: 'Recherche par nom de lieu, comportant une caractéristique géographique, détecté dans le texte',
        dataValue: 'namedEntities.unitex.geogName',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'Personne',
        dataInfo: 'Recherche par nom de personne détecté dans le texte',
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
        dataInfo: 'Recherche par titre de la revue ou monographie',
        dataValue: 'host.title',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'ISSN',
        dataInfo: 'Recherche par numéro ISSN de la revue papier',
        dataValue: 'host.issn',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'e-ISSN',
        dataInfo: 'Recherche par numéro ISSN de la revue électronique',
        dataValue: 'host.eissn',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'ISBN',
        dataInfo: 'Recherche par numéro ISBN de la monographie papier',
        dataValue: 'host.isbn',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'e-ISBN',
        dataInfo: 'Recherche par numéro ISBN de la monographie électronique',
        dataValue: 'host.eisbn',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'DOI',
        dataInfo: 'Recherche par DOI de la revue',
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
        dataInfo: 'Recherche par titre de la série',
        dataValue: 'serie.title',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'Issn de la série',
        dataInfo: 'Recherche par numéro ISSN de la série papier',
        dataValue: 'serie.issn',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'e-Issn de la série',
        dataInfo: 'Recherche par numéro ISSN de la série électronique',
        dataValue: 'serie.eissn',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'DOI de la série',
        dataInfo: 'Recherche par DOI de la série',
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
        dataInfo: 'Recherche par noms d\'auteur du document référencé',
        dataValue: 'rebBibs.author.name',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'Date de publication',
        dataInfo: 'Recherche par date de publication du document référencé',
        dataValue: 'refBibs.publicationDate',
        operatorsField: [
          { id: 'is_equal', typeField: 'date' },
          { id: 'is_between', typeField: 'range' },
        ],
      },
      {
        dataTitle: 'Titre article',
        dataInfo: 'Recherche par titre du document référencé',
        dataValue: 'refBibs.title',
        operatorsField: [
          { id: 'is_equal', typeField: 'text' },
        ],
      },
      {
        dataTitle: 'DOI',
        dataInfo: 'Recherche par DOI du document référencé',
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
