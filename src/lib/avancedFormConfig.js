const catalogList = [
  {
    title: 'Souvent utilisé',
    items: [
      {
        dataTitle: 'Tous champs',
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

export default catalogList;
