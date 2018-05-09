export default {
    extractMetadataXml: 'XML "Extensible Markup Language" :'
    + ' format de structuration de documents (fourni par l\'éditeur)',
    extractMetadataMods: '"Metadata Object Description Schema" :'
    + ' format de description des métadonnées (commun à tous les éditeurs)',
    extractMetadataJson: '"JavaScript Object Description Schema" : format standard permettant la représentation et'
    + ' l\'échange de données structurées',
    extractFulltextPdf: 'Texte intégral PDF "Portable Document Format"',
    extractFulltextTei: '"Text Encoding Initiative" : format de codage de documents structurés',
    extractFulltextTxt: 'Texte brut',
    extractFulltextOcr: '"Optical Character Recognition" : version améliorée du format TXT',
    extractFulltextZip: 'Format de compression de fichiers (ici, Ensemble des formats PDF et XML d\'un même fichier ?)',
    extractFulltextTiff: '"Tagged Image File Format" : format image d\'un texte ',

    extractAnnexesPdf: '"Portable Document Format"',
    extractAnnexesTxt: 'Texte brut',
    extractAnnexesDoc: 'Word : format de document Microsoft',
    extractAnnexesPpt: 'PowerPoint : format de présentation Microsoft',
    extractAnnexesXls: 'Excel : format de tableur Microsoft ',
    extractAnnexesXlsx: 'Excel : nouveau format de tableur Microsoft',
    extractAnnexesXml: '"Extensible Markup Language" : format fourni par l\'éditeur',
    extractAnnexesRtf: '"Rich Text Format" : format de texte Microsoft',
    extractAnnexesJpeg: '"Joint Photographic Experts Group" : format d\'image',
    extractAnnexesGif: '"Graphics Interchange Format" : format d\'image',
    extractAnnexesWmv: '"Windows Media Video" : format de vidéo',
    extractAnnexesQt: '"Quick Time" : format de vidéo',
    extractAnnexesMpeg: '"Moving Picture Experts Group" : format conteneur pour encapsuler'
    + ' des données de type multimédia',
    extractAnnexesMp4: ' MP4 ou MPEG4 : format conteneur pour encapsuler des données de type multimédia',
    extractAnnexesAvi: '"Audio Video Interleave" : format de stockage de données audio et vidéo',

    extractCoversPdf: '"Portable Document Format"',
    extractCoversGif: '"Graphics Interchange Format" : format d\'image',
    extractCoversJpg: '"Joint Photographic Experts Group" : format d\'image',
    extractCoversTiff: '"Tagged Image File Format" : format image d\'un texte',
    extractCoversHtml: '"HyperText Markup Language" : format de pages web',

    extractEnrichmentsTei: '"Text Encoding Initiative" : format de codage de documents structurés',

    vieillissement: 'id:(EC2AEDC35AEE067247941C2E4FCDBC02064CD3F0 OR '
    + 'B26BE9965A30A15CD9C2A71BA8E68F4DD8B85AB9 OR 3A8120D6DED99C2FAD8D43AF79856518895BA64A OR '
    + '1AF40874F4E6B8EF15BDFB36AFA89A44D36BBA58 OR 01EB25144332E39473868AF8B0F14983799C26F6 OR '
    + '17D7475DD004ED094F4F47CFC05D8EC2B8700646 OR 514805A478954ADD1317C6CA82BADF3B26490A61 OR '
    + '6B98A9867529969E3C54E224CE4A1533BE6CBEB1)',

    astrophysique: '((host.issn:"0922-6435" AND publicationDate:1995) OR (host.issn:"1387-6473" AND '
    + 'publicationDate:2001) OR (host.title:"JOURNAL OF GEOPHYSICAL RESEARCH: SPACE PHYSICS" '
    + 'AND publicationDate:1980 AND host.issue.raw:A1)) AND genre:("research-article" OR '
    + '"article" OR "brief-communication")',

    poissons: 'abstract:((species OR genus) AND (/fishe?s?/ chondrichth* osteichth*)) AND '
    + 'language:eng AND qualityIndicators.pdfVersion:[1.2 TO *] AND '
    + 'qualityIndicators.score:[3.0 TO *] AND (publicationDate:[1950 TO *] OR '
    + 'copyrightDate:[1950 TO *]) NOT '
    + '(fungu* bacteria* /microorganisms?/ /viruse?s?/ neuro* botan* protozoa* parasit*)',

    polaris: 'title:(Arctic NOT (arctic AND /charr?/) OR Arctique OR Subarctic~1 OR '
    + 'Sub?arctic OR Subarctique OR "North pole" OR "pôle Nord" OR "north?west passage" OR '
    + '"northwest passage" OR "Passage du Nord-Ouest" OR "north?east passage" OR '
    + '"northeast passage" OR "passage du Nord-Est" OR "Northern sea route" OR '
    + '"route maritime du Nord" OR Alaska  OR Greenland OR Groënland OR Groenland OR '
    + 'Grönland OR Grünland OR Grønland OR Iceland OR Islande OR Svalbard OR '
    + '/spit[sz]berg(en)?/ OR Lapland OR Laponie OR Finnmark OR "Northwest Territories" OR '
    + '"Territoires du Nord-Ouest" OR /nun[ai](tsia)?v[aiu][tk]/ OR "Ile Ellesmere" OR '
    + '"Ellesmere Island" OR "Queen Elizabeth Islands" OR "îles Reine Elizabeth" OR '
    + '(Franz AND /jose[fp]h?/ AND Land) OR "Archipel François-Joseph" OR '
    + '"Terre François-Joseph" OR "Jan Mayen" OR "Kola Peninsula" OR "Péninsule de Kola" OR '
    + '"Novaya Zemlya" OR "Nouvelle Zemble" OR "Severnaya Zemlya" OR Chukotka OR Tchoukotka OR '
    + '"New Siberian Islands" OR "îles de Nouvelle-Sibérie" OR "Nouvelle-Sibérie" OR '
    + '/[yi]ako?uti?[ae]?/ OR Sakha OR "Oural Polaire" OR "Polar Urals" OR Baffin OR '
    + 'Barents OR Chukchi OR "Mer des Tchouktches" OR "Mer Blanche" OR "White Sea" OR '
    + '"Mer de Beaufort" OR "Beaufort Sea" OR "Mer de Kara" OR "Kara Sea" OR '
    + '"Mer de Laptev" OR "Laptev Sea" OR "Mer de Norvège" OR "Norwegian Sea" OR '
    + '"Mer de Sibérie Est" OR "Mer de Sibérie Orientale" OR "East Siberian Sea" OR '
    + '"Beaufort seas"~2  OR "East Siberian seas"~2 OR "Kara seas"~2  OR "Laptev seas"~2 OR '
    + '"Norwegian seas"~2 OR "White seas"~2 OR "Détroit de Davis" OR "Davis Strait" OR '
    + '"Détroit du Danemark" OR "Danemark Strait" OR "Détroit de Fram" OR "Fram Strait" OR '
    + '(/beh?ring/ AND strait) OR (Détroit AND de AND /beh?ring/) OR /ale?o?ut[ei]?i?[tq]?/ OR '
    + '/sugpia[tq]/ OR Tchouktches OR Inuit OR Inuk OR Inuvialuit OR /i[nñ]upia?[tqk]/ OR '
    + '/naukan(ski)?/ OR /nenee?[nt]s(es)?/ OR Samoyeds OR /sag?[dl]l[ei]u?rmiut/ OR Sámi OR '
    + 'Saami OR Lapps OR Laplanders OR Lapons OR /sireniki?/ OR /es[kq]u?im[oa]u?[sx]?/ OR '
    + '/yupii?[tk]/ OR "Yup\'ik") AND publicationDate:[* TO 1918}',
};
