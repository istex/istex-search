/* eslint  max-len: "off" */
export default {
    extractMetadataXml: '<a href="https://istex-doc.gitbook.io/documentation-istex/tdm/annexes/liste-des-formats" target="_blank" rel="noopener noreferrer"> Extensible Markup Language (langage de balisage extensible) </a>'
    + 'Fichier original fourni par l\'éditeur selon une DTD propre.',
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

// Exemples de requête

    vieillissement: 'ark:/67375/HXZ-3PZ5S1MB-7\nark:/67375/HXZ-XH6SRM66-7\nark:/67375/6H6-K00Q3697-8\nark:/67375/6H6-52QRK0X3-F\nark:/67375/HXZ-H5NSV5QF-M\nark:/67375/HXZ-J1BLQKH4-3\nark:/67375/HXZ-QVSXSCHW-P\nark:/67375/HXZ-RVC4D13J-W\nark:/67375/6H6-19QHR7H2-6\nark:/67375/HXZ-0F8518D4-K\nark:/67375/6H6-9Q9HLC0X-7\nark:/67375/6H6-QTZPZZXD-H',

    astrophysique: '((host.issn:"0922-6435" AND publicationDate:1995) OR (host.issn:"1387-6473" AND (publicationDate:[1990 TO *] OR copyrightDate:[1990 TO *])) OR (host.title:"Journal of Geophysical Research: Space Physics" AND publicationDate:1980 AND host.issue.raw:A1))',

    orthophonie: 'subject.value:( orthophon* OR logotherapie OR "speech therapy") AND language:fre AND genre:("research-article" OR "article" OR "brief-communication")',

    ecologie: 'host.title :("Journal of Fish Biology" OR "Marine Ecology") AND qualityIndicators.pdfVersion:[1.2 TO *] AND qualityIndicators.score:[3.0 TO *]',

    motClefsSystematiqueVegetale: '((species genus genera) AND ("plant genetic*" "plant taxonomy" "plant communit*" palynology* phytogeograph*)) NOT (/fung(i|use?s?)/ NOT (mycorrhiz* ectomycorrhiz* endomycorrhiz*))',

    regExpSystematiqueVegetale: 'abstract:((plantae viridiplantae /gymnosperm(s?|ae)/) NOT (/bacteri(a|um)/ NOT (actinorhiz* rhizobia azorhizob* bradyrhizob* sinorhizob*) /viruse?s?/ protozoa* protist*))',

    regExpArctic: '/ale?o?ut[ei]?i?[tq]?/ OR /sugpia[tq]/ OR Tchouktches OR Inuit OR Inuk OR Inuvialuit OR /i[nñ]upia?[tqk]/ OR /naukan(ski)?/ OR /nenee?[nt]s(es)?/ OR Samoyeds OR /sag?[dl]l[ei]u?rmiut/ OR Sámi OR Saami OR Lapps OR Laplanders OR Lapons OR /sireniki?/ OR /es[kq]u?im[oa]u?[sx]?/ OR /yupii?[tk]/ OR "Yup\'ik"',

    opArctic: 'title:(Arctic + Subarctic~1 + Sub?arctic + Greenland + Groënland + Groenland + Grönland + Grünland + Grønland + Iceland + Svalbard + /spit[sz]berg(en)?/ + "Norwegian seas"~2)',

    echinoderme: 'id:( 733524962094471CDF009136D2986E2750742881 OR 6D092CC49B1BE5EF78DC7FBC3CBCF0C2B700BEBF OR 6A174B72611EEBBDCF634ACB8780A8CC1B868EA8 OR 4FCAF1CAD0B088B59B041C009BA43C104516BAEF OR 801B862B8C3673672B946F3E8051E4F2225AC279)',
};
