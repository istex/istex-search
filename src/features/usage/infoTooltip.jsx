import React from 'react';

export const formats = {
  fulltext: {
    infoText:
  <p className='text-sm text-white'>
    Le choix du format de texte intégral<br />
    est à faire en fonction de l’origine des<br />
    documents, des transformations<br />
    réalisées par Istex sur ces<br />
    documents et de l’utilisation<br />
    souhaitée pour le corpus.<br />
    Voir la <a className='font-bold text-istcolor-blue cursor-pointer hover:underline underline-offset-2' target='_blank' href='https://doc.istex.fr/tdm/annexes/liste-des-formats.html#texte-int%C3%A9gral' rel='noreferrer'>documentation Istex</a>
  </p>,
    formats: {
      pdf: {
        infoText:
  <p className='text-sm text-white'>
    <a className='font-bold text-istcolor-blue cursor-pointer hover:underline underline-offset-2' target='_blank' href='https://doc.istex.fr/tdm/annexes/liste-des-formats.html#o-pdf-portable-document-format-format-de-document-portable' rel='noreferrer'>PDF : Portable Document Format</a><br />
    Fichier original fourni par l'éditeur
  </p>,
      },
      tei: {
        infoText:
  <p className='text-sm text-white'>
    <a className='font-bold text-istcolor-blue cursor-pointer hover:underline underline-offset-2' target='_blank' href='https://doc.istex.fr/tdm/annexes/liste-des-formats.html#o-tei-text-encoding-initiative-initiative-pour-lencodage-du-texte' rel='noreferrer'>TEI : Text Encoding Initiative</a><br />
    Fichier XML produit par Istex selon<br />
    les guidelines P5 du format TEI, soit à<br />
    partir des XML originaux fournis par<br />
    l’éditeur, soit à partir du PDF via une<br />
    transformation PDF to Text
  </p>,
      },
      txt: {
        infoText:
  <p className='text-sm text-white'>
    <a className='font-bold text-istcolor-blue cursor-pointer hover:underline underline-offset-2' target='_blank' href='https://doc.istex.fr/tdm/annexes/liste-des-formats.html#o-txt-text' rel='noreferrer'>TXT : Text</a><br />
    Fichier en texte brut produit par<br />
    Istex à partir d’une transformation<br />
    du PDF original à l’aide du logiciel<br />
    PDF to Text ou via une chaîne de<br />
    réocérisation permettant d’améliorer<br />
    la qualité du texte
  </p>,
      },
      cleaned: {
        infoText:
  <p className='text-sm text-white'>
    <a className='font-bold text-istcolor-blue cursor-pointer hover:underline underline-offset-2' target='_blank' href='https://doc.istex.fr/tdm/annexes/liste-des-formats.html#o-cleaned-nettoy%C3%A9' rel='noreferrer'>CLEANED : Nettoyé</a><br />
    Fichier en texte brut, produit par<br />
    Istex, dépourvu de mise en forme,<br />
    image, tableau ou formule et qui<br />
    contient uniquement le contenu<br />
    textuel du corps du document<br />
    (entre le résumé et les références<br />
    bibliographiques)
  </p>,
      },
      zip: {
        infoText:
  <p className='text-sm text-white'>
    <a className='font-bold text-istcolor-blue cursor-pointer hover:underline underline-offset-2' target='_blank' href='https://doc.istex.fr/tdm/annexes/liste-des-formats.html#o-zip' rel='noreferrer'>ZIP</a><br />
    Répertoire compressé contenant,<br />
    pour chaque document du corpus,<br />
    les fichiers fournis par l’éditeur (PDF,<br />
    XML structuré, images, couvertures,<br />
    annexes), ainsi que le JSON produit<br />
    par Istex
  </p>,
      },
      tiff: {
        infoText:
  <p className='text-sm text-white'>
    <a className='font-bold text-istcolor-blue cursor-pointer hover:underline underline-offset-2' target='_blank' href='https://doc.istex.fr/tdm/annexes/liste-des-formats.html#o-tiff-tagged-image-file-format-format-de-fichier-dimage-%C3%A9tiquet%C3%A9' rel='noreferrer'>TIFF : Tagged Image File Format</a><br />
    Fichier original fourni par l’éditeur<br />
    sous format image (uniquement<br />
    pour les éditeurs EBBO et ECCO)
  </p>,
      },
    },
  },
  metadata: {
    infoText:
  <p className='text-sm text-white'>
    Informations bibliographiques<br />
    permettant de présenter un<br />
    document (nom de l’auteur,<br />
    affiliation, revue, éditeur, etc.).<br />
    Voir la <a className='font-bold text-istcolor-blue cursor-pointer hover:underline underline-offset-2' target='_blank' href='https://doc.istex.fr/tdm/annexes/liste-des-formats.html#m%C3%A9tadonn%C3%A9es' rel='noreferrer'>documentation Istex</a>
  </p>,
    formats: {
      json: {
        infoText:
  <p className='text-sm text-white'>
    <a className='font-bold text-istcolor-blue cursor-pointer hover:underline underline-offset-2' target='_blank' href='https://doc.istex.fr/tdm/annexes/liste-des-formats.html#o-json-javascript-object-notation-notation-des-objets-du-langage-javascript' rel='noreferrer'>JSON : JavaScript Object Notation</a><br />
    Fichier produit par Istex<br />
    rassemblant toutes les métadonnées<br />
    et les enrichissements
  </p>,
      },
      xml: {
        infoText:
  <p className='text-sm text-white'>
    <a className='font-bold text-istcolor-blue cursor-pointer hover:underline underline-offset-2' target='_blank' href='https://doc.istex.fr/tdm/annexes/liste-des-formats.html#o-xml-extensible-markup-language-langage-de-balisage-extensible' rel='noreferrer'>XML : Extensible Markup Language</a><br />
    Fichier original fourni par l'éditeur<br />
    selon une DTD propre
  </p>,
      },
      mods: {
        infoText:
  <p className='text-sm text-white'>
    <a className='font-bold text-istcolor-blue cursor-pointer hover:underline underline-offset-2' target='_blank' href='https://doc.istex.fr/tdm/annexes/liste-des-formats.html#o-mods-metadata-object-description-schema-sch%C3%A9ma-de-description-objet-de-m%C3%A9tadonn%C3%A9es-' rel='noreferrer'>MODS : Metadata Object Description Schema</a><br />
    Fichier XML standardisé produit par<br />
    Istex à partir d’une transformation<br />
    des XML originaux<br />
  </p>,
      },
    },
  },
  enrichments: {
    infoText:
  <p className='text-sm text-white'>
    Informations complémentaires, au<br />
    format TEI, produites par Istex :<br />
    catégories scientifiques (multicat et<br />
    nb), références bibliographiques<br />
    structurées (refBibs), version<br />
    structurée du texte intégral issue de<br />
    Grobid (grobidFulltext), termes<br />
    d’indexation (teeft), entités nommées<br />
    (unitex).<br />
    Voir la <a className='font-bold text-istcolor-blue cursor-pointer hover:underline underline-offset-2' target='_blank' href='https://doc.istex.fr/tdm/annexes/liste-des-formats.html#enrichissements' rel='noreferrer'>documentation Istex</a>
  </p>,
    formats: {
      multicat: {
        infoText:
  <p className='text-sm text-white'>
    Catégories scientifiques{' '}
    <a className='font-bold text-istcolor-blue cursor-pointer hover:underline underline-offset-2' target='_blank' href='https://sciencemetrix-category.data.istex.fr/' rel='noreferrer'>Science-<br />Metrix</a>,{' '}
    <a className='font-bold text-istcolor-blue cursor-pointer hover:underline underline-offset-2' target='_blank' href='https://scopus-category.data.istex.fr/' rel='noreferrer'>Scopus</a> et{' '}
    <a className='font-bold text-istcolor-blue cursor-pointer hover:underline underline-offset-2' target='_blank' href='https://wos-category.data.istex.fr/' rel='noreferrer'>Web of Science</a><br />
    rattachées aux documents Istex.<br />
    Issues des classifications<br />
    homonymes, elles ont été attribuées<br />
    aux documents par appariement<br />
    grâce à l’outil multicat
  </p>,
      },
      nb: {
        infoText:
  <p className='text-sm text-white'>
    <a className='font-bold text-istcolor-blue cursor-pointer hover:underline underline-offset-2' target='_blank' href='https://inist-category.data.istex.fr/' rel='noreferrer'>Catégories scientifiques Inist</a> issues<br />
    des classifications des bases Pascal<br />
    et Francis. Elles ont été attribuées<br />
    aux documents Istex par<br />
    apprentissage automatique via<br />
    l’approche statistique<br />
    « <a className='font-bold text-istcolor-blue cursor-pointer hover:underline underline-offset-2' target='_blank' href='https://enrichment-process.data.istex.fr/ark:/67375/R0H-DV0BN0B8-J' rel='noreferrer'>Bayésien naïf</a> » (Naive Bayesian ou<br />
    nb)
  </p>,
      },
      grobidFulltext: {
        infoText:
  <p className='text-sm text-white'>
    Version structurée du texte intégral<br />
    obtenue à l'aide de l'outil <a className='font-bold text-istcolor-blue cursor-pointer hover:underline underline-offset-2' target='_blank' href='https://enrichment-process.data.istex.fr/ark:/67375/R0H-2WXX0NK2-9' rel='noreferrer'>Grobid</a>.
  </p>,
      },
      refBibs: {
        infoText:
  <p className='text-sm text-white'>
    Références bibliographiques des<br />
    documents, structurées à l’aide de<br />
    l’outil <a className='font-bold text-istcolor-blue cursor-pointer hover:underline underline-offset-2' target='_blank' href='https://enrichment-process.data.istex.fr/ark:/67375/R0H-2WXX0NK2-9' rel='noreferrer'>Grobid</a>
  </p>,
      },
      teeft: {
        infoText:
  <p className='text-sm text-white'>
    Termes d’indexation, extraits des<br />
    documents en texte intégral grâce à<br />
    l’outil <a className='font-bold text-istcolor-blue cursor-pointer hover:underline underline-offset-2' target='_blank' href='https://enrichment-process.data.istex.fr/ark:/67375/R0H-R25KK4KZ-Q' rel='noreferrer'>Teeft</a>
  </p>,
      },
      unitex: {
        infoText:
  <p className='text-sm text-white'>
    <a className='font-bold text-istcolor-blue cursor-pointer hover:underline underline-offset-2' target='_blank' href='https://named-entity.data.istex.fr/' rel='noreferrer'>Entités nommées</a>, extraites des<br />
    documents Istex à l'aide du logiciel<br />
    <a className='font-bold text-istcolor-blue cursor-pointer hover:underline underline-offset-2' target='_blank' href='https://enrichment-process.data.istex.fr/ark:/67375/R0H-KGDTPS40-S' rel='noreferrer'>Unitex-CasSys</a>
  </p>,
      },
    },
  },
  covers: {
    infoText:
  <p className='text-sm text-white'>
    Fichiers originaux parfois fournis par<br />
    l’éditeur pour présenter la<br />
    couverture de la revue dans laquelle<br />
    est publié le document. Ils peuvent<br />
    être de plusieurs types : documents<br />
    textuels, images, pages web, etc.<br />
    Voir la <a className='font-bold text-istcolor-blue cursor-pointer hover:underline underline-offset-2' target='_blank' href='https://doc.istex.fr/tdm/annexes/liste-des-formats.html#couvertures' rel='noreferrer'>documentation Istex</a>
  </p>,
  },
  annexes: {
    infoText:
  <p className='text-sm text-white'>
    Fichiers originaux parfois fournis par<br />
    l’éditeur pour accompagner et<br />
    compléter le texte intégral. Ils<br />
    peuvent être de plusieurs types :<br />
    textes, tableurs, diaporamas, images,<br />
    vidéos, multimédias, etc.<br />
    Voir la <a className='font-bold text-istcolor-blue cursor-pointer hover:underline underline-offset-2' target='_blank' href='https://doc.istex.fr/tdm/annexes/liste-des-formats.html#annexes' rel='noreferrer'>documentation Istex</a>
  </p>,
  },
};
