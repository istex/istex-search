interface NavbarLink {
  label: string;
  url: string;
}

export interface NavbarLinks {
  istex: NavbarLink;
  others: NavbarLink[];
}

export const navbarLinks: NavbarLinks = {
  istex: {
    label: "istex",
    url: "https://istex.fr/",
  },
  others: [
    {
      label: "a_zJournalsList",
      url: "https://revue-sommaire.istex.fr/",
    },
    {
      label: "documentaryDataset",
      url: "https://documentary-dataset.data.istex.fr/",
    },
    {
      label: "specializedCorpus",
      url: "https://corpus-specialises.corpus.istex.fr/",
    },
    {
      label: "objectifTdm",
      url: "https://objectif-tdm.inist.fr/",
    },
    {
      label: "loterre",
      url: "https://www.loterre.fr/",
    },
  ],
};
