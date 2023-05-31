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
    label: 'Navbar.istex',
    url: 'https://istex.fr/',
  },
  others: [
    {
      label: 'Navbar.a_zJournalsList',
      url: 'https://revue-sommaire.istex.fr/',
    },
    {
      label: 'Navbar.documentaryDataset',
      url: 'https://documentary-dataset.data.istex.fr/',
    },
    {
      label: 'Navbar.specializedCorpus',
      url: 'https://corpus-specialises.corpus.istex.fr/',
    },
    {
      label: 'Navbar.objectifTdm',
      url: 'https://objectif-tdm.inist.fr/',
    },
    {
      label: 'Navbar.loterre',
      url: 'https://www.loterre.fr/',
    },
  ],
};
