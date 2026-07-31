import type { Translation } from "./fr-FR";

const esES: Translation = {
  home: {
    metadata: {
      description:
        "Aplicación web dedicada a la constitución y extracción de subcorpus de Istex.",
    },
    Navbar: {
      burgerMenuAriaLabel: "Recursos externos de documentación científica",
      istex: "acceso a istex.fr",
      a_zJournalsList: "Sumarios de revistas",
      documentaryDataset: "Referencias documentales",
      specializedCorpus: "Corpus especializados",
      istexTdm: "Istex TDM",
      loterre: "Istex Loterre",
      LocalePicker: {
        selectAriaLabel: "Idioma",
      },
    },
    Header: {
      baseline:
        "<strong>Cree y descargue su corpus científico</strong><br></br>La primera etapa de su proyecto de minería de textos",
    },
    SearchSection: {
      searchModeGroupAriaLabel: "Modos de búsqueda",
      regularMode: "Búsqueda simple",
      assistedMode: "Búsqueda asistida",
      importMode: "Importar lista",
      button: "Buscar",
      resultCount:
        "{count, plural, =0 {<resultsSpan>#</resultsSpan> documento encontrado} =1 {<resultsSpan>#</resultsSpan> documento encontrado} other {<resultsSpan>#</resultsSpan> documentos encontrados}}",
      RegularSearchInput: {
        searchTitle: "Cree su consulta",
        resultsTitle: "Resultados de su consulta",
        placeholder: '"física nuclear" AND language:spa',
        promptButtonAriaLabel: "Búsqueda en lenguaje natural",
        examplesTitle: "Pruebe ejemplos de consultas",
      },
      AssistedSearchInput: {
        searchTitle: "Asistente para la creación de consultas",
        resultsTitle: "Resultados de su consulta asistida",
        assistedButton: "Edición asistida",
        expertButton: "Edición experta",
        button: "Buscar",
        addRule: "Añadir una regla",
        addGroup: "Añadir un grupo",
        removeGroup: "Eliminar",
        removeRule: "Eliminar esta regla",
        reset: "Restablecer",
        field: "Campo",
        searchField: "Buscar un campo",
        comparator: "Comparador",
        searchComparator: "Buscar un comparador",
        value: "Valor",
        searchValue: "Buscar un valor",
        valueTooltip:
          "Introduzca solamente un valor. No se permiten metacaracteres como * o ?",
        minValue: "Valor mínimo",
        maxValue: "Valor máximo",
        equals: "es igual a",
        contains: "contiene",
        between: "está entre",
        startsWith: "comienza con",
        endsWith: "termina con",
        greater: "es estrictamente mayor que",
        smaller: "es estrictamente menor que",
        true: "verdadero",
        false: "falso",
        operator: "Operador",
        ExpertSearchInput: {
          goBackButton: "Cancelar la edición experta",
          validate: "Confirme sus modificaciones",
          Dialog: {
            title: "¿Está seguro?",
            content:
              "Al confirmar sus modificaciones, no podrá continuar utilizando el asistente para la creación de consultas.",
            confirm: "Confirmar",
          },
        },
      },
      ImportInput: {
        searchTitle: "Importe sus identificadores",
        resultsTitle: "Resultados de su importación",
        placeholder:
          "Ingrese su lista de identificadores* (ARK, DOI, ID Istex) o importe su archivo .corpus\n* un formato a la vez",
        button: "Buscar",
        uploadIconAlt: "Cargar un archivo .corpus",
      },
      PromptModal: {
        title: "Búsqueda en lenguaje natural",
        betaChipLabel: "BETA",
        introduction:
          "Describa su necesidad en lenguaje natural. La consulta será convertida automáticamente en sintaxis Lucene, compatible con Istex\u00A0Search.",
        noteTitle: "Aclaraciones",
        note: "Actualmente se permiten los siguientes campos: título, resumen, palabras clave del autor, autores, fecha de publicación, idioma y tipo de documento (artículo de investigación). Las consultas se generan automáticamente a partir de su descripción y pueden variar de una generación a otra.",
        placeholder:
          "Artículos de investigación en inglés sobre energía nuclear publicados después de 2015",
        submitButton: "Generar la consulta",
      },
    },
    CorpusSection: {
      corpus: {
        title: "Explore corpus ya compilados",
        subtitle:
          "Explore los {corpusLength} corpus especializados más recientes",
        seeMoreButton: "VER TODO",
        contactButton: "CORPUS DISPONIBLES A PEDIDO",
        CorpusGrid: [
          {
            collectionTitle: "Colección Memoria",
            title: "Mémoire-Neurosciences",
          },
          {
            collectionTitle: "Colección Paleoclimatología",
            title: "Paleosaurus",
          },
          {
            collectionTitle: "Colección Paleoclimatología",
            title: "Paleonotus",
          },
          {
            collectionTitle: "Colección Traducción",
            title: "Machine Translation",
          },
          {
            collectionTitle: "Colección Sistemática",
            title: "Systématique Animale",
          },
          {
            collectionTitle: "Colección Sistemática",
            title: "Systématique Végétale",
          },
        ],
      },
      connectors: {
        title: "Configure su descarga de acuerdo a sus necesidades",
        subtitle:
          "Los conectores de Istex\u00A0Search facilitan el acceso a herramientas de análisis de corpus.",
        paragraph:
          "Sea cual sea su necesidad (curación de datos, semantización, análisis estadísticos, reconstrucciones filogenéticas, etc.), Istex\u00A0Search permite la descarga en formatos compatibles con herramientas de minería de textos.",
        buttonTop: "Más información sobre estas herramientas:",
        connectorSuggestion:
          "¿Desea sugerir un conector hacia una herramienta?",
        contactButton: "CONTÁCTENOS",
      },
    },
    DownloadSection: {
      title: "Descargue sus datos en 3 pasos",
      body: "Los metadatos de las publicaciones presentes en Istex son de acceso público. Los textos completos y los contenidos enriquecidos generados por Istex son accesibles para los miembros de las instituciones francesas de educación superior e investigación.",
      downloadSteps: [
        {
          title: "Crear una consulta",
          body: "Existen varios modos de búsqueda que permiten consultar Istex: la búsqueda simple, la búsqueda asistida y la importación de una lista de identificadores.",
        },
        {
          title: "Explorar resultados",
          body: "Diferentes filtros e indicadores están a su disposición para analizar el contenido del corpus y afinar su consulta para obtener un corpus de calidad.",
        },
        {
          title: "Descarga masiva",
          body: "Istex\u00A0Search permite descargar hasta {maxSize, number} documentos seleccionando los datos (metadatos, textos completos, enriquecimientos) en formatos adaptados a sus necesidades.",
        },
      ],
    },
    CourseSection: {
      title: "¿Necesita mejorar su manejo de la herramienta Istex\u00A0Search?",
      body: "El equipo de Istex organiza cursos sobre metodología de constitución de corpus.",
      button: "Acceder a los cursos disponibles",
    },
  },
  results: {
    metadata: {
      title: "Resultados",
    },
    placeholders: {
      noTitle: "Sin título",
      noAbstract: "Sin resumen",
    },
    unavailableTitle: "Funcionalidad no disponible en este modo de búsqueda",
    CompleteQuery: {
      prefix: "Consulta: ",
      copy: {
        "aria-label": "Copiar la consulta al portapapeles.",
        success: "Consulta copiada al portapapeles.",
      },
    },
    ResultsToolbar: {
      groupAriaLabel: "Modos de visualización de los resultados",
      gridAriaLabel: "Visualización en modo cuadrícula",
      listAriaLabel: "Visualización en modo lista",
    },
    PerPage: "mostrar: ",
    Sorting: {
      sortBy: "Ordenar por: ",
      asc: "orden ascendente",
      desc: "orden descendente",
      qualityOverRelevance: "pertinencia y calidad",
      random: "aleatorio",
      publicationDate: "fecha de publicación",
      title: {
        raw: "título",
      },
    },
    ResultsCard: {
      select: "Seleccionar",
      unselect: "Deseleccionar",
      include: "Incluir",
      exclude: "Excluir",
    },
    DownloadButton: "Descargar el corpus ({resultCount, number})",
    Pagination: {
      firstPage: "Ir a la primera página",
      lastPage: "Ir a la última página",
      previousPage: "Ir a la página anterior",
      nextPage: "Ir a la página siguiente",
      currentPageIndex: "{page, number}",
      page: "PÁGINA",
      on: "DE {total, number}",
    },
    Filters: {
      NumberFilter: {
        range: "intervalo",
        value: "valor",
        to: "a",
        minPlaceholder: "Mínimo",
        maxPlaceholder: "Máximo",
        valuePlaceholder: "Valor",
      },
      TextFilter: {
        search: "Buscar",
        sortKeyAsc: "Ordenar los valores por orden alfanumérico ascendente",
        sortKeyDesc: "Ordenar los valores por orden alfanumérico descendente",
        sortDocCountAsc: "Ordenar por número de documentos en orden ascendente",
        sortDocCountDesc:
          "Ordenar por número de documentos en orden descendente",
      },
      apply: "Aplicar",
      clear: "Borrar",
      clearAll: "Borrar todo",
      categoriesGroupHeader: "Categorías científicas",
    },
    FilterTags: {
      title: "Sus filtros activos:",
      tooltip: "Haga clic en los filtros siguientes para excluirlos.",
      clear: "Eliminar el filtro «\u00A0{value}\u00A0»",
    },
    Document: {
      backToResults: "Volver a los resultados",
      share: "Compartir el documento",
      previousButtonLabel: "Ir al documento anterior",
      nextButtonLabel: "Ir al documento siguiente",
      docInfos: "Información sobre este documento",
      seeDoc: "Consultar este documento",
      fulltext: "Texto completo",
      metadata: "Metadatos",
      annexes: "Anexos",
      enrichments: "Enriquecimientos",
      openAccess: "Acceso abierto",
      istexView: "Istex\u00A0View",
      istexViewNewChip: "Nuevo",
      selectDocument: "Seleccionar",
      unselectDocument: "Deseleccionar",
      excludeDocument: "Excluir",
      includeDocument: "Incluir",
      formatLinks: {
        fulltext: "Acceder al texto completo en formato {extension}",
        metadata: "Acceder a los metadatos en formato {extension}",
        annexes: "Acceder al anexo en formato {extension}",
        multicat:
          "Acceder a las categorías WoS, Scopus y Science-Metrix generadas por Multicat en formato {extension}",
        teeft:
          "Acceder a la indexación generada por Teeft en formato {extension}",
        unitex:
          "Acceder a las entidades nombradas generadas por Unitex en formato {extension}",
        nb: "Acceder a las categorías Inist generadas por Nb en formato {extension}",
        grobidFulltext:
          "Acceder al texto estructurado por Grobid en formato {extension}",
        refBibs:
          "Acceder a las referencias bibliográficas estructuradas por Grobid en formato {extension}",
        openAccess: "Acceder a este documento en su plataforma de origen",
        openAccessAltText: "Icono de acceso abierto",
        istexView:
          "Explorar el documento XML TEI y sus enriquecimientos en Istex\u00A0View",
        istexViewAltText: "Logo de Istex View",
      },
      RetractedBadge: {
        label: "Retractado",
      },
    },
    Panel: {
      indicators: "Indicadores de su corpus",
      resultCount:
        "{count, plural, =0 {(# documento)} =1 {(# documento)} other {(# documentos)}}",
      summaryPresence: "Resumen",
      pdfPresence: "Texto en formato PDF",
      cleanedTextPresence: "Texto depurado",
      publicationLanguage: "Idioma de publicación",
      docCount: "{count, number}\u00A0doc.",
      languageCount:
        "{language}\u00A0: {count, number} doc. ({percentage}\u00A0%)",
      otherLanguage: "otros",
      compatibility: "Compatibilidad con los conectores",
    },
    MemoModal: {
      title: "Buscar con Lucene",
      subtitle:
        "Lucene es el lenguaje de consulta del motor de búsqueda de Istex (<link>Elasticsearch</link>). En modo <strong>búsqueda simple</strong>, la sintaxis Lucene permite seleccionar eficientemente los documentos que le interesan.",
      general: {
        title: "Elementos generales",
        list: [
          "Por defecto, la búsqueda no distingue entre mayúsculas y minúsculas, pero sí es sensible a los signos diacríticos.<pre>evolución ≠ evolucion</pre>",
          'La búsqueda de <strong>expresiones multipalabras</strong> se realiza entre comillas.<pre>"speech therapy"</pre>',
          "El espacio en blanco equivale al operador <strong>OR</strong>.<pre>fungi OR fungus = fungi fungus</pre>",
        ],
      },
      operators: {
        title: "Operadores",
        list: [
          "<strong>AND</strong> (o <strong>&&</strong>) muestra los documentos que contienen todos los términos señalados.<pre>cine AND Chaplin</pre>",
          "<strong>OR</strong> (o <strong>||</strong>) muestra los documentos que contienen al menos uno de los términos señalados.<pre>Greenland OR subarctic</pre>",
          "<strong>+</strong> puede utilizarse antes de un término para que sea obligatorio.<pre>+cine +Chaplin</pre>",
          "<strong>NOT</strong> muestra los documentos que no contienen el término señalado.<pre>linguistics NOT syntax</pre>",
          "<strong>-</strong> (o <strong>!</strong>) puede utilizarse antes de un término para excluirlo.<pre>linguistics -syntax</pre>",
        ],
      },
      fields: {
        title: "Campos",
        list: [
          "La lista de campos está disponible en el <fieldsLink>anexo del tutorial</fieldsLink>.",
          "La consulta de un campo específico se realiza con el nombre técnico del campo seguido de <strong>:</strong> (ej. <i>title</i>, <i>publicationDate</i>, <i>doi</i>).<pre>title:Rimbaud</pre>",
          "Sin especificación, todos los campos serán consultados.",
          'La consulta exacta de un campo es posible gracias a <strong>.raw</strong> (ej. <i>host.title.raw</i>).<pre>title.raw:"Verlaine, Flaubert et Rimbaud"</pre>',
        ],
      },
      metacharacters: {
        title: "Metacaracteres * y ?",
        list: [
          "El metacarácter <strong>*</strong> reemplaza de 0 a <i>n</i> carácter(es).<pre>title:memoriz*</pre>",
          "El metacarácter <strong>?</strong> reemplaza 1 carácter.<pre>title:m?mori?ación</pre>",
          "Los metacaracteres <strong>*</strong> y <strong>?</strong> no están permitidos en las consultas entre comillas.",
        ],
      },
      parentheses: {
        title: "Paréntesis",
        list: [
          "Los paréntesis permiten establecer prioridades en las operaciones y realizar agrupaciones.<pre>(Luke OR Leia) AND Skywalker</pre><pre>title:(plastic NOT bertrand)</pre>",
        ],
      },
      ranges: {
        title: "Búsqueda por intervalo",
        list: [
          "Es posible buscar por intervalos utilizando corchetes (búsqueda inclusiva) o llaves (búsqueda exclusiva).<pre>publicationDate:[2015 TO *]</pre><pre>title.raw:'{ape TO appliance}'</pre>",
        ],
      },
      boosting: {
        title: "Ponderación",
        list: [
          'El metacarácter <strong>^ seguido de un número</strong> permite otorgar mayor peso a un término de la búsqueda.<pre>"star wars"^2 skywalker</pre>',
          "La ponderación influye en el orden de los resultados, pero no en su cantidad.",
        ],
      },
      fuzzy: {
        title: "Búsqueda difusa",
        list: [
          "El metacarácter <strong>~</strong> permite buscar variantes de escritura de un término (máximo 2 caracteres de diferencia).<pre>title:memorización~2</pre>",
        ],
      },
      proximity: {
        title: "Búsqueda de proximidad",
        list: [
          'El metacarácter <strong>~ seguido de un número</strong> permite buscar una expresión con 2 términos más o menos distantes.<pre>title:"reading child"~10</pre><pre>title:"return jedi"~2</pre>',
        ],
      },
      regex: {
        title: "Expresiones regulares",
        list: [
          "Las expresiones regulares se identifican colocándolas entre <strong>//</strong>.<pre>title:/[frc]at/</pre>",
        ],
      },
      seeMoreLink: "MÁS INFORMACIÓN",
    },
    Share: {
      email: {
        corpus: {
          subject: "Se le ha compartido una búsqueda de Istex",
          body: "Aquí tiene el enlace a la búsqueda compartida de Istex\u000A{url}",
        },
        document: {
          subject: "Se le ha compartido un documento de Istex",
          body: "Aquí tiene el enlace al documento compartido de Istex\u000A{url}",
        },
      },
    },
  },
  download: {
    title: "Configure su descarga",
    downloadButton: "Descargar",
    InfoPanels: {
      query: {
        title: "Consulta",
        copy: {
          "aria-label": "Copiar la consulta al portapapeles",
          success: "La consulta ha sido copiada al portapapeles.",
        },
      },
      rawRequest: {
        title: "Consulta en bruto completa",
        copy: {
          "aria-label": "Copiar la consulta en bruto completa al portapapeles",
          success:
            "La consulta en bruto completa ha sido copiada al portapapeles.",
        },
      },
      seeMoreLink: "MÁS INFORMACIÓN",
    },
    ResultsSettings: {
      download: "Descargar",
      allButton: "Todo",
      resultCount: "{count, number}",
      warningTooltip:
        "Su consulta arroja {resultCount, number} resultados, pero el límite permitido es {maxSize, number}.",
    },
    SelectedDoc: {
      title: "Documentos seleccionados",
      unselect: "Deseleccionar",
      noDocTitle: "Sin título",
    },
    ArchiveSettings: {
      archiveType: "Formato del archivo:",
      compressionLevel: "Nivel de compresión:",
    },
    ArchiveSizeWarning: {
      title: "Advertencia",
      message: "Tamaño estimado\u00A0>\u00A0{size}",
    },
    WaitingModal: {
      title: "Descarga de su corpus",
      approximately: "aproximadamente",
      closeModal: "Su descarga ha comenzado, puede cerrar esta ventana.",
      citationTitle: "Cómo citar a Istex\u00A0Search",
    },
    Citation: {
      copy: {
        "aria-label": "Copiar la cita al portapapeles",
        success: "La cita ha sido copiada al portapapeles.",
      },
    },
  },
  help: {
    button: "¿NECESITA AYUDA?",
    modal: {
      title: "¿Necesita ayuda?",
      description:
        "Consulte nuestras preguntas frecuentes (FAQ), la documentación de Istex o nuestros tutoriales",
      faq: "FAQ",
      documentation: "Documentación",
      tutorial: "Tutorial",
      contact:
        "No dude en contactarnos si lo necesita, le responderemos rápidamente.",
      contactTitle: "Escríbanos",
      message:
        "Envíenos un mensaje a través del <externalLink>formulario de contacto</externalLink>.",
    },
  },
  FloatingSideMenu: {
    historyButton: "Historial de búsquedas",
    shareButton: "Compartir la búsqueda",
    memoButton: "Consejos de búsqueda",
  },
  History: {
    title: "Historial",
    currentRequestTitle: "Búsqueda en curso",
    historyTitle: "Últimas descargas",
    emptyHistoryContent: "Su historial está vacío.",
    editAriaLabel: "Editar esta consulta",
    shareAriaLabel: "Compartir esta consulta",
    downloadAriaLabel: "Descargar el corpus correspondiente a esta consulta",
    deleteAriaLabel: "Eliminar esta consulta",
    clearHistory: "Borrar el historial",
    ConfirmModal: {
      title: "Confirmación",
      content: "¿Está seguro de que desea borrar el historial de descargas?",
      confirm: "Borrar",
    },
  },
  cookieConsent: {
    consentModal: {
      title: "Cookies",
      description:
        "Utilizamos cookies y recopilamos datos para mejorar su experiencia en nuestro sitio.",
      acceptAllBtn: "Aceptar todo",
      acceptNecessaryBtn: "Rechazar todo",
      showPreferencesBtn: "Gestionar preferencias",
    },
    preferencesModal: {
      title: "Gestionar preferencias",
      acceptAllBtn: "Aceptar todo",
      acceptNecessaryBtn: "Rechazar todo",
      savePreferencesBtn: "Aceptar la selección",
      closeIconLabel: "Cerrar la ventana emergente",
      sections: [
        {
          title: "Cookies",
          description:
            "Utilizamos cookies y recopilamos datos para mejorar su experiencia en nuestro sitio.",
        },
        {
          title: "Cookies estrictamente necesarias",
          description:
            "Estas cookies son necesarias para el correcto funcionamiento del sitio.",
          linkedCategory: "necessary",
          cookieTable: {
            headers: {
              name: "Nombre",
              description: "Descripción",
              duration: "Duración",
            },
            body: [
              {
                name: "NEXT_LOCALE",
                description:
                  "Cookie para almacenar el idioma de visualización.",
                duration: "1 año",
              },
              {
                name: "cc_cookie",
                description:
                  "Cookie para almacenar sus preferencias de cookies.",
                duration: "6 meses",
              },
            ],
          },
        },
        {
          title: "Estadísticas",
          description:
            'Estas cookies recopilan información sobre su utilización del sitio a través de la herramienta <a href="https://matomo.org/" target="_blank" rel="noreferrer">Matomo</a>. Todos los datos son anónimos y no pueden utilizarse para identificarle.',
          linkedCategory: "analytics",
          cookieTable: {
            headers: {
              name: "Nombre",
              description: "Descripción",
              duration: "Duración",
            },
            body: [
              {
                name: "_pk_id.*",
                description:
                  'Estas cookies son utilizadas por <a href="https://matomo.org/" target="_blank" rel="noreferrer">Matomo</a> para identificar a los usuarios mediante la asignación de un identificador único y permiten realizar un seguimiento de la navegación.',
                duration: "13 meses",
              },
              {
                name: "_pk_ses.*",
                description:
                  'Estas cookies son utilizadas por <a href="https://matomo.org/" target="_blank" rel="noreferrer">Matomo</a> para identificar a los usuarios mediante la asignación de una sesión única.',
                duration: "30 minutos",
              },
            ],
          },
        },
        {
          title: "Más información",
          description:
            'Para obtener más información, consulte nuestra <a href="https://www.istex.fr/politique-de-confidentialite/" target="_blank" rel="noreferrer">política de privacidad</a>.',
        },
      ],
    },
  },
  CopyButton: {
    error: "No se puede escribir en el portapapeles.",
    badEnv: "Esta funcionalidad no se encuentra disponible.",
  },
  ErrorCard: {
    title: "Error",
  },
  NotFoundPage: {
    title: "¡Vaya! Página no encontrada",
    body: "La página a la que intenta acceder no está disponible. Le sugerimos las siguientes alternativas para continuar:",
    list: [
      "Regresar a la <homeLink><strong>página de inicio</strong></homeLink> de Istex\u00A0Search para realizar una nueva consulta.",
      "Utilizar la <assistedSearchLink><strong>búsqueda asistida</strong></assistedSearchLink> para obtener ayuda al consultar Istex.",
    ],
    contact:
      "Si cree que se trata de un error, no dude en <link>contactarnos</link> para informarnos.",
  },
  errors: {
    SyntaxError: "Se ha detectado un error de sintaxis.",
    PartialAstError: "Por favor, complete todos los campos.",
    IdTypeNotSupportedError:
      '"{id}" no forma parte de los formatos de identificadores admitidos.',
    IdsError:
      "{count, plural, =1 {Se ha detectado un error de sintaxis en la línea {lines}.} other {Se han detectado errores de sintaxis en las líneas {lines}.}}",
    CorpusFileFormatError: "El archivo no cumple con el formato .corpus.",
    EmptyIdsError: "Introduzca uno o varios identificadores.",
    FileReadError: "Error al leer el archivo.",
    QIdNotFoundError: "Ninguna consulta corresponde a {qId}.",
    QIdSaveError: "Error al guardar {qId}.",
    EmptyQueryError: "Por favor, ingrese una consulta.",
    GetAggregationError: "Se ha producido un error al recuperar los valores.",
    EmptyPromptError: "Por favor, ingrese una solicitud.",
    TextLuceneError:
      "El servicio de generación de consultas Lucene se encuentra indisponible momentáneamente; por favor, vuelva a intentarlo más tarde.",
    TextLuceneEmptyResponseError:
      "No ha sido posible interpretar su solicitud, por favor reformúlela.",
    default:
      "Se ha producido un error. Por favor, vuelva a intentarlo más tarde.",
  },
  Modal: {
    closeButton: "Cerrar la ventana emergente",
  },
  NumberInput: {
    incrementAriaLabel: "Aumentar el valor",
    decrementAriaLabel: "Disminuir el valor",
  },
  config: {
    examples: [
      "Exploración espacial de la luna",
      "Muñeca Barbie",
      "Método Montessori",
      "50 años de la ley Veil",
      "Juegos Paralímpicos",
      "Facteur Cheval",
    ],
    formats: {
      fulltext: {
        category: "Texto completo",
        pdf: "PDF",
        tei: "TEI",
        txt: "TXT",
        cleaned: "CLEANED",
        zip: "ZIP",
        tiff: "TIFF",
      },
      metadata: {
        category: "Metadatos",
        json: "JSON",
        xml: "XML",
        mods: "MODS",
      },
      enrichments: {
        category: "Enriquecimientos",
        multicat: "multicat",
        nb: "nb",
        grobidFulltext: "grobidFulltext",
        refBibs: "refBibs",
        teeft: "teeft",
        unitex: "unitex",
      },
      others: {
        annexes: "Anexos",
        covers: "Portadas",
      },
    },
    usages: {
      custom: {
        label: "Uso personalizado",
        description:
          "Seleccione el tipo de datos que desea descargar (textos completos, metadatos, enriquecimientos, anexos o portadas) y su formato.",
      },
      lodex: {
        label: "Lodex",
        description:
          "Aplicación web de código abierto dedicada a los datos estructurados que permite visualizar y enriquecer los datos para, posteriormente, transformarlos en una página web.",
      },
      cortext: {
        label: "Cortext",
        description:
          "Software libre diseñado para la minería y análisis de corpus textuales heterogéneos que integra múltiples procesos automáticos (análisis de grupos, visualización de datos temporales, etc.).",
      },
      gargantext: {
        label: "GarganText",
        description:
          "Software libre dedicado al análisis colaborativo de conjuntos de documentos, que combina herramientas de procesamiento del lenguaje natural, análisis de redes complejas y visualización interactiva de datos.",
      },
      nooj: {
        label: "NooJ",
        description:
          "Aplicación destinada al análisis de corpus que permite construir recursos lingüísticos (diccionarios, gramáticas) y aplicarlos con fines de anotación o consulta (análisis semántico, concordancias, extracción de información, etc.).",
      },
    },
    archiveTypes: {
      zip: "ZIP",
      tar: "TAR.GZ",
    },
    compressionLevels: {
      "0": "sin",
      "6": "media",
      "9": "alta",
    },
  },
  languages: {
    aar: "afar",
    abk: "abjasio",
    alg: "lenguas algonquinas",
    ang: "inglés antiguo",
    arc: "arameo",
    frm: "francés medio",
    fro: "francés antiguo",
    glv: "manés",
    grc: "griego antiguo",
    moh: "mohawk",
    mul: "multilingüe",
    nai: "lenguas indígenas de Norteamérica ",
    "new": "newari",
    roa: "lenguas romances",
    sco: "escocés",
    syr: "siríaco",
    und: "indeterminado",
    unknown: "desconocido",
    way: "wayana",
    zxx: "sin contenido lingüístico",
  },
  fields: {
    author: {
      affiliations: {
        title: "Afiliación del autor",
        description: "Búsqueda por afiliación del autor",
      },
      name: {
        title: "Nombre del autor",
        description: "Búsqueda por el nombre del autor",
      },
    },
    host: {
      author: {
        affiliations: {
          title: "Afiliación del autor de una monografía",
          description: "Búsqueda por la afiliación del autor de una monografía",
        },
        name: {
          title: "Nombre del autor de una monografía",
          description: "Búsqueda por el nombre del autor de una monografía",
        },
      },
      doi: {
        title: "DOI de la revista",
        description: "Búsqueda por el DOI de la revista",
      },
      eisbn: {
        title: "e-ISBN de la monografía",
        description: "Búsqueda por el ISBN de la monografía electrónica",
      },
      eissn: {
        title: "e-ISSN de la revista",
        description: "Búsqueda por el ISSN de la revista electrónica",
      },
      isbn: {
        title: "ISBN de la monografía",
        description: "Búsqueda por el ISBN de la monografía impresa",
      },
      issn: {
        title: "ISSN de la revista",
        description: "Búsqueda por el ISSN de la revista impresa",
      },
      language: {
        title: "Idioma de publicación de la revista o monografía",
        description:
          "Búsqueda por el idioma de publicación de la revista o monografía",
      },
      subject: {
        value: {
          title: "Palabra clave de la revista",
          description:
            "Búsqueda por una de las palabras clave asignadas a la revista",
        },
      },
      conference: {
        name: {
          title: "Nombre de la conferencia (revista o monografía)",
          description:
            "Búsqueda por el nombre de la conferencia (actas publicadas en forma de revista o monografía)",
        },
      },
      issue: {
        title: "Número de la revista o monografía",
        description: "Búsqueda por el número de la revista o monografía",
      },
      title: {
        filterTitle: "Revista / monografía (top 10)",
        title: "Título de la revista o monografía",
        description: "Búsqueda en el título de la revista o monografía",
      },
      genre: {
        title: "Tipo de publicación",
        description: "Búsqueda por tipo de publicación",
        journal: "Revista",
        "book-series": "Monografía en serie",
        database: "Base de datos",
        book: "Monografía",
        "reference-works": "Obra de referencia",
      },
      volume: {
        title: "Volumen de la revista o monografía",
        description: "Búsqueda por volumen de la revista o monografía",
      },
    },
    arkIstex: {
      title: "ARK",
      description: "Búsqueda por el ARK del documento",
    },
    corpusName: {
      title: "Paquete",
      description: "Búsqueda por paquete editorial disponible en Istex",
    },
    categories: {
      inist: {
        title: "Categoría Inist",
        description:
          "Búsqueda por área científica de la clasificación Pascal y Francis",
      },
      scienceMetrix: {
        title: "Categoría Science-Metrix",
        description:
          "Búsqueda por área científica de la clasificación Science-Metrix",
      },
      scopus: {
        title: "Categoría Scopus",
        description: "Búsqueda por área científica de la clasificación Scopus",
      },
      wos: {
        title: "Categoría WoS",
        description:
          "Búsqueda por área científica de la clasificación Web of Science",
      },
    },
    figure: {
      title: "Contenido de la leyenda",
      description: "Búsqueda en el contenido de las leyendas",
    },
    table: {
      title: "Contenido de las tablas",
      description: "Búsqueda en el contenido de las tablas",
    },
    "fulltext@1": {
      title: "Cuerpo del texto",
      description:
        "Búsqueda en el cuerpo del texto sin los metadatos (limitado a documentos estructurados)",
    },
    publicationDate: {
      title: "Fecha de publicación",
      description: "Búsqueda por la fecha de publicación",
    },
    refBibs: {
      publicationDate: {
        title: "Fecha de publicación de una referencia bibliográfica ",
        description:
          "Búsqueda por la fecha de publicación de una referencia bibliográfica",
      },
      doi: {
        title: "DOI de una referencia bibliográfica",
        description: "Búsqueda por el DOI de una referencia bibliográfica",
      },
      author: {
        name: {
          title: "Nombre del autor de una referencia bibliográfica",
          description:
            "Búsqueda por el nombre del autor de una referencia bibliográfica de tipo artículo o capítulo",
        },
      },
      host: {
        author: {
          name: {
            title:
              "Nombre del autor de una referencia bibliográfica de tipo monografía",
            description:
              "Búsqueda por el nombre del autor de una referencia bibliográfica de tipo monografía",
          },
        },
        title: {
          title: "Título de revista de una referencia bibliográfica",
          description:
            "Búsqueda por el título de revista de una referencia bibliográfica",
        },
        volume: {
          title: "Volumen de revista de una referencia bibliográfica",
          description:
            "Búsqueda por el número de volumen de una referencia bibliográfica",
        },
      },
      title: {
        title: "Título de una referencia bibliográfica",
        description: "Búsqueda por el título de una referencia bibliográfica",
      },
      serie: {
        title: {
          title: "Título de la colección de una referencia bibliográfica",
          description:
            "Búsqueda por el título de la colección de una referencia bibliográfica",
        },
      },
    },
    serie: {
      doi: {
        title: "DOI de la colección",
        description: "Búsqueda por el DOI de la colección de monografías",
      },
      eissn: {
        title: "e-ISSN de la colección",
        description:
          "Búsqueda por el número ISSN de la colección de monografías electrónicas",
      },
      issn: {
        title: "ISSN de la colección",
        description:
          "Búsqueda por el número ISSN de la colección de monografías impresas",
      },
      conference: {
        name: {
          title: "Nombre de la conferencia (colección)",
          description:
            "Búsqueda por el nombre de la conferencia (actas publicadas en forma de colección)",
        },
      },
      issue: {
        title: "Número de la colección",
        description: "Búsqueda por el número de la colección de monografías",
      },
      title: {
        title: "Título de la colección",
        description: "Búsqueda en el título de la colección de monografías",
      },
    },
    doi: {
      title: "DOI del documento",
      description: "Búsqueda por el DOI del documento",
    },
    hasFormula: {
      title: "Fórmula",
      description: "Búsqueda de la presencia de una fórmula matemática",
    },
    language: {
      title: "Idioma",
      description: "Búsqueda por idioma del documento",
    },
    subject: {
      lang: {
        title: "Idioma de las palabras clave del autor",
        description: "Búsqueda por el idioma de las palabras clave del autor",
      },
      value: {
        title: "Palabra clave del autor",
        description: "Búsqueda por una de las palabras clave del autor",
      },
    },
    accessCondition: {
      contentType: {
        title: "Acceso abierto",
        description: "Búsqueda de documentos en acceso abierto",
        isOpenAccess: "Sí",
        isNotOpenAccess: "No",
        unknown: "Desconocido",
      },
      value: {
        title: "Tipo de acceso abierto",
        description: "Búsqueda de documentos por tipo de acceso abierto",
      },
    },
    keywords: {
      teeft: {
        title: "Palabra clave Teeft",
        description:
          "Búsqueda por una de las palabras clave extraídas por Teeft (Terms Extraction for English Full Texts)",
      },
    },
    namedEntities: {
      unitex: {
        orgName: {
          title: "Denominación de la organización",
          description:
            'Búsqueda por entidad nombrada de tipo "nombre de la organización" detectada por Unitex',
        },
        orgName_funder: {
          title: "Denominación del organismo financiador",
          description:
            'Búsqueda por entidad nombrada de tipo "organismo financiador" detectada por Unitex',
        },
        placeName: {
          title: "Denominación de lugar administrativo",
          description:
            'Búsqueda por entidad nombrada de tipo "nombre de lugar geopolítico o administrativo" detectada por Unitex',
        },
        geogName: {
          title: "Denominación de lugar geográfico",
          description:
            'Búsqueda por entidad nombrada de tipo "nombre de lugar" detectada por Unitex',
        },
        persName: {
          title: "Denominación de persona",
          description:
            'Búsqueda por entidad nombrada de tipo "nombre de persona" detectada por Unitex',
        },
        date: {
          title: "Denominación de fecha",
          description:
            'Búsqueda por entidad nombrada de tipo "fecha, período, siglo" detectada por Unitex',
        },
        ref_url: {
          title: "URL",
          description:
            'Búsqueda por entidad nombrada de tipo "URL" detectada por Unitex',
        },
      },
    },
    qualityIndicators: {
      pdfCharCount: {
        title: "Número de caracteres del PDF",
        description: "Búsqueda por número de caracteres del documento PDF",
      },
      abstractCharCount: {
        title: "Número de caracteres del resumen",
        description: "Búsqueda por número de caracteres del resumen",
      },
      pdfWordCount: {
        title: "Número de palabras del PDF",
        description: "Búsqueda por número de palabras del documento PDF",
      },
      abstractWordCount: {
        title: "Número de palabras del resumen",
        description: "Búsqueda por número de palabras del resumen",
      },
      pdfWordsPerPage: {
        title: "Número de palabras por página del PDF",
        description:
          "Búsqueda por número de palabras por página en el documento PDF",
      },
      pdfPageCount: {
        title: "Número de páginas del PDF",
        description: "Búsqueda por número de páginas del documento PDF",
      },
      pdfText: {
        title: "PDF textual",
        description:
          "Búsqueda de documentos en formato PDF que contienen texto",
      },
      refBibsNative: {
        title: "Referencias bibliográficas",
        description: "Búsqueda por referencias bibliográficas nativas",
        true: "Proporcionadas por el editor",
        false: "Obtenidas a través Grobid",
      },
      score: {
        title: "Puntuación",
        description: "Búsqueda por puntuación de calidad del documento",
      },
      teiSource: {
        title: "Referencia TEI",
        description: "Búsqueda por procedencia del documento TEI",
      },
      tdmReady: {
        title: "Texto depurado (TXT)",
        description:
          "Búsqueda de documentos en formato TXT compatibles con herramientas de minería de textos (TDM)",
        true: "Sí",
        false: "No",
      },
      pdfVersion: {
        title: "Versión del PDF",
        description: "Búsqueda por versión del formato PDF del documento",
      },
    },
    abstract: {
      title: "Resumen",
      description: "Búsqueda en el resumen",
    },
    fulltext: {
      title: "Texto completo",
      description:
        "Búsqueda en el texto completo (cuerpo del texto y metadatos)",
    },
    title: {
      title: "Título",
      description: "Búsqueda en el título",
    },
    enrichments: {
      type: {
        title: "Tipo de enriquecimiento",
        description: "Búsqueda de documentos que contengan un enriquecimiento",
        multicat: "Categorías WoS, Scopus, Science-Metrix (Multicat)",
        teeft: "Indexación (Teeft)",
        unitex: "Entidades nombradas (Unitex)",
        nb: "Categorías Inist (Naive Bayes)",
        grobidFulltext: "Texto estructurado (Grobid)",
        refBibs: "Referencias bibliográficas estructuradas (Grobid)",
      },
    },
    genre: {
      title: "Tipo de contenido",
      description: "Búsqueda por tipo de documento",
      "research-article": "Artículo de investigación",
      article: "Artículo",
      other: "Otro",
      abstract: "Resumen",
      "brief-communication": "Comunicación breve",
      "book-reviews": "Reseña de monografía",
      "review-article": "Artículo de revisión",
      conference: "Congreso",
      editorial: "Editorial",
      chapter: "Capítulo",
      "case-report": "Estudio de caso",
      "collected-courses": "Recopilación de cursos",
      book: "Monografía",
      encyclopedia: "Entrada de enciclopedia",
    },
  },
};

export default esES;
