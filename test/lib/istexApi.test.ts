import { MIN_PER_PAGE, NO_FORMAT_SELECTED, formats } from "@/config";
import * as Module from "@/lib/istexApi";

describe("Istex API related functions", () => {
  it("should correctly build result preview url", () => {
    const minimalParams: Module.BuildResultPreviewUrlOptions = {
      queryString: "hello",
    };
    const completeParams: Module.BuildResultPreviewUrlOptions = {
      queryString: "hello",
      perPage: MIN_PER_PAGE,
      page: 3,
      fields: ["abstract", "title"],
    };

    expect(Module.buildResultPreviewUrl(minimalParams).toString()).toBe(
      "https://api.istex.fr/document?q=hello&size=10&from=0&rankBy=qualityOverRelevance&output=*&sid=istex-dl&facet=corpusName%5B*%5D%2Clanguage%5B*%5D%2CpublicationDate%2Chost.genre%5B*%5D%2Cgenre%5B*%5D%2Cenrichments.type%5B*%5D%2Ccategories.wos%5B*%5D%2Ccategories.scienceMetrix%5B*%5D%2Ccategories.scopus%5B*%5D%2Ccategories.inist%5B*%5D%2CqualityIndicators.pdfWordCount%2CqualityIndicators.pdfCharCount%2CqualityIndicators.score%2CqualityIndicators.pdfVersion%5B*%5D%2CqualityIndicators.refBibsNative%2CqualityIndicators.abstractCharCount%5B1-1000000%5D%2CqualityIndicators.pdfText%2CqualityIndicators.tdmReady%2CqualityIndicators.teiSource",
    );

    expect(Module.buildResultPreviewUrl(completeParams).toString()).toBe(
      "https://api.istex.fr/document?q=hello&size=10&from=20&rankBy=qualityOverRelevance&output=abstract%2Ctitle&sid=istex-dl&facet=corpusName%5B*%5D%2Clanguage%5B*%5D%2CpublicationDate%2Chost.genre%5B*%5D%2Cgenre%5B*%5D%2Cenrichments.type%5B*%5D%2Ccategories.wos%5B*%5D%2Ccategories.scienceMetrix%5B*%5D%2Ccategories.scopus%5B*%5D%2Ccategories.inist%5B*%5D%2CqualityIndicators.pdfWordCount%2CqualityIndicators.pdfCharCount%2CqualityIndicators.score%2CqualityIndicators.pdfVersion%5B*%5D%2CqualityIndicators.refBibsNative%2CqualityIndicators.abstractCharCount%5B1-1000000%5D%2CqualityIndicators.pdfText%2CqualityIndicators.tdmReady%2CqualityIndicators.teiSource",
    );
  });

  it("should correctly build full api url", () => {
    const params: Module.BuildFullApiUrlOptions = {
      queryString: "hello",
      selectedFormats: formats.fulltext.pdf,
      size: 2,
    };
    const noSelectFormatsParams: Module.BuildFullApiUrlOptions = {
      queryString: "hello",
      selectedFormats: NO_FORMAT_SELECTED,
      size: 2,
    };

    expect(Module.buildFullApiUrl(params).toString()).toBe(
      "https://api.istex.fr/document?q=hello&size=2&rankBy=qualityOverRelevance&sid=istex-dl&extract=fulltext%5Bpdf%5D",
    );

    expect(Module.buildFullApiUrl(noSelectFormatsParams).toString()).toBe(
      "https://api.istex.fr/document?q=hello&size=2&rankBy=qualityOverRelevance&sid=istex-dl",
    );
  });

  it("should correctly create query with filters", () => {
    const queryString = "hello";
    const filters: Module.Filter = {
      corpusName: ["springer", "elsevier"],
      language: ["eng"],
      genre: ["article", "book"],
    };

    expect(Module.createCompleteQuery(queryString, filters)).toBe(
      '(hello) AND corpusName:("springer" OR "elsevier") AND language:("eng") AND genre:("article" OR "book")',
    );
  });

  it("should correctly create query with filters with NOT", () => {
    const queryString = "hello";
    const filters: Module.Filter = {
      corpusName: ["springer", "!elsevier"],
      language: ["eng"],
      genre: ["article", "book"],
    };

    expect(Module.createCompleteQuery(queryString, filters)).toBe(
      '(hello) AND corpusName:("springer" NOT "elsevier") AND language:("eng") AND genre:("article" OR "book")',
    );
  });

  it("should correctly create query with filters with NOT and range values", () => {
    const queryString = "hello";
    const filters: Module.Filter = {
      corpusName: ["springer", "elsevier"],
      language: ["eng"],
      genre: ["article", "book"],
      publicationDate: ["!2010-2020"],
    };

    expect(Module.createCompleteQuery(queryString, filters)).toBe(
      '(hello) AND corpusName:("springer" OR "elsevier") AND language:("eng") AND genre:("article" OR "book") AND (NOT publicationDate:[2010 TO 2020])',
    );
  });

  it("should correctly create query with selected documents", () => {
    const queryString = "hello";
    const selectedDocuments = ["123", "456"];

    expect(
      Module.createCompleteQuery(queryString, undefined, selectedDocuments),
    ).toBe('(hello) AND id:("123" OR "456")');
  });

  it("should correctly create query with excluded documents", () => {
    const queryString = "hello";
    const excludedDocuments = ["123", "456"];

    expect(
      Module.createCompleteQuery(
        queryString,
        undefined,
        undefined,
        excludedDocuments,
      ),
    ).toBe('(hello) AND (NOT id:("123" OR "456"))');
  });

  it("should correctly create query with filters and selected documents", () => {
    const queryString = "hello";
    const filters: Module.Filter = {
      corpusName: ["springer", "elsevier"],
      language: ["eng"],
      genre: ["article", "book"],
    };
    const selectedDocuments = ["123", "456"];

    expect(
      Module.createCompleteQuery(queryString, filters, selectedDocuments),
    ).toBe(
      '(hello) AND corpusName:("springer" OR "elsevier") AND language:("eng") AND genre:("article" OR "book") AND id:("123" OR "456")',
    );
  });

  it("should correctly create query with filters and excluded documents", () => {
    const queryString = "hello";
    const filters: Module.Filter = {
      corpusName: ["springer", "elsevier"],
      language: ["eng"],
      genre: ["article", "book"],
    };
    const excludedDocuments = ["123", "456"];

    expect(
      Module.createCompleteQuery(
        queryString,
        filters,
        undefined,
        excludedDocuments,
      ),
    ).toBe(
      '(hello) AND corpusName:("springer" OR "elsevier") AND language:("eng") AND genre:("article" OR "book") AND (NOT id:("123" OR "456"))',
    );
  });

  it("should correctly build result preview url with filters", () => {
    const params: Module.BuildResultPreviewUrlOptions = {
      queryString: "hello",
      filters: {
        corpusName: ["springer", "elsevier"],
        language: ["eng"],
      },
    };

    expect(Module.buildResultPreviewUrl(params).toString()).toBe(
      "https://api.istex.fr/document?q=%28hello%29+AND+corpusName%3A%28%22springer%22+OR+%22elsevier%22%29+AND+language%3A%28%22eng%22%29&size=10&from=0&rankBy=qualityOverRelevance&output=*&sid=istex-dl&facet=corpusName%5B*%5D%2Clanguage%5B*%5D%2CpublicationDate%2Chost.genre%5B*%5D%2Cgenre%5B*%5D%2Cenrichments.type%5B*%5D%2Ccategories.wos%5B*%5D%2Ccategories.scienceMetrix%5B*%5D%2Ccategories.scopus%5B*%5D%2Ccategories.inist%5B*%5D%2CqualityIndicators.pdfWordCount%2CqualityIndicators.pdfCharCount%2CqualityIndicators.score%2CqualityIndicators.pdfVersion%5B*%5D%2CqualityIndicators.refBibsNative%2CqualityIndicators.abstractCharCount%5B1-1000000%5D%2CqualityIndicators.pdfText%2CqualityIndicators.tdmReady%2CqualityIndicators.teiSource",
    );
  });

  it("should correctly build result preview url with selected documents", () => {
    const params: Module.BuildResultPreviewUrlOptions = {
      queryString: "hello",
      selectedDocuments: ["123", "456"],
    };

    expect(Module.buildResultPreviewUrl(params).toString()).toBe(
      "https://api.istex.fr/document?q=%28hello%29+AND+id%3A%28%22123%22+OR+%22456%22%29&size=10&from=0&rankBy=qualityOverRelevance&output=*&sid=istex-dl&facet=corpusName%5B*%5D%2Clanguage%5B*%5D%2CpublicationDate%2Chost.genre%5B*%5D%2Cgenre%5B*%5D%2Cenrichments.type%5B*%5D%2Ccategories.wos%5B*%5D%2Ccategories.scienceMetrix%5B*%5D%2Ccategories.scopus%5B*%5D%2Ccategories.inist%5B*%5D%2CqualityIndicators.pdfWordCount%2CqualityIndicators.pdfCharCount%2CqualityIndicators.score%2CqualityIndicators.pdfVersion%5B*%5D%2CqualityIndicators.refBibsNative%2CqualityIndicators.abstractCharCount%5B1-1000000%5D%2CqualityIndicators.pdfText%2CqualityIndicators.tdmReady%2CqualityIndicators.teiSource",
    );
  });

  it("should correctly build result preview url with excluded documents", () => {
    const params: Module.BuildResultPreviewUrlOptions = {
      queryString: "hello",
      excludedDocuments: ["123", "456"],
    };

    expect(Module.buildResultPreviewUrl(params).toString()).toBe(
      "https://api.istex.fr/document?q=%28hello%29+AND+%28NOT+id%3A%28%22123%22+OR+%22456%22%29%29&size=10&from=0&rankBy=qualityOverRelevance&output=*&sid=istex-dl&facet=corpusName%5B*%5D%2Clanguage%5B*%5D%2CpublicationDate%2Chost.genre%5B*%5D%2Cgenre%5B*%5D%2Cenrichments.type%5B*%5D%2Ccategories.wos%5B*%5D%2Ccategories.scienceMetrix%5B*%5D%2Ccategories.scopus%5B*%5D%2Ccategories.inist%5B*%5D%2CqualityIndicators.pdfWordCount%2CqualityIndicators.pdfCharCount%2CqualityIndicators.score%2CqualityIndicators.pdfVersion%5B*%5D%2CqualityIndicators.refBibsNative%2CqualityIndicators.abstractCharCount%5B1-1000000%5D%2CqualityIndicators.pdfText%2CqualityIndicators.tdmReady%2CqualityIndicators.teiSource",
    );
  });

  it("should correctly build result preview url with filters and selected documents", () => {
    const params: Module.BuildResultPreviewUrlOptions = {
      queryString: "hello",
      filters: {
        corpusName: ["springer", "elsevier"],
        language: ["eng"],
      },
      selectedDocuments: ["123", "456"],
    };

    expect(Module.buildResultPreviewUrl(params).toString()).toBe(
      "https://api.istex.fr/document?q=%28hello%29+AND+corpusName%3A%28%22springer%22+OR+%22elsevier%22%29+AND+language%3A%28%22eng%22%29+AND+id%3A%28%22123%22+OR+%22456%22%29&size=10&from=0&rankBy=qualityOverRelevance&output=*&sid=istex-dl&facet=corpusName%5B*%5D%2Clanguage%5B*%5D%2CpublicationDate%2Chost.genre%5B*%5D%2Cgenre%5B*%5D%2Cenrichments.type%5B*%5D%2Ccategories.wos%5B*%5D%2Ccategories.scienceMetrix%5B*%5D%2Ccategories.scopus%5B*%5D%2Ccategories.inist%5B*%5D%2CqualityIndicators.pdfWordCount%2CqualityIndicators.pdfCharCount%2CqualityIndicators.score%2CqualityIndicators.pdfVersion%5B*%5D%2CqualityIndicators.refBibsNative%2CqualityIndicators.abstractCharCount%5B1-1000000%5D%2CqualityIndicators.pdfText%2CqualityIndicators.tdmReady%2CqualityIndicators.teiSource",
    );
  });

  it("should correctly build result preview url with filters and excluded documents", () => {
    const params: Module.BuildResultPreviewUrlOptions = {
      queryString: "hello",
      filters: {
        corpusName: ["springer", "elsevier"],
        language: ["eng"],
      },
      excludedDocuments: ["123", "456"],
    };

    expect(Module.buildResultPreviewUrl(params).toString()).toBe(
      "https://api.istex.fr/document?q=%28hello%29+AND+corpusName%3A%28%22springer%22+OR+%22elsevier%22%29+AND+language%3A%28%22eng%22%29+AND+%28NOT+id%3A%28%22123%22+OR+%22456%22%29%29&size=10&from=0&rankBy=qualityOverRelevance&output=*&sid=istex-dl&facet=corpusName%5B*%5D%2Clanguage%5B*%5D%2CpublicationDate%2Chost.genre%5B*%5D%2Cgenre%5B*%5D%2Cenrichments.type%5B*%5D%2Ccategories.wos%5B*%5D%2Ccategories.scienceMetrix%5B*%5D%2Ccategories.scopus%5B*%5D%2Ccategories.inist%5B*%5D%2CqualityIndicators.pdfWordCount%2CqualityIndicators.pdfCharCount%2CqualityIndicators.score%2CqualityIndicators.pdfVersion%5B*%5D%2CqualityIndicators.refBibsNative%2CqualityIndicators.abstractCharCount%5B1-1000000%5D%2CqualityIndicators.pdfText%2CqualityIndicators.tdmReady%2CqualityIndicators.teiSource",
    );
  });

  it("should correctly build full api url with filters", () => {
    const params: Module.BuildFullApiUrlOptions = {
      queryString: "hello",
      selectedFormats: formats.fulltext.pdf,
      size: 2,
      filters: {
        corpusName: ["springer", "elsevier"],
        language: ["eng"],
      },
    };

    expect(Module.buildFullApiUrl(params).toString()).toBe(
      "https://api.istex.fr/document?q=%28hello%29+AND+corpusName%3A%28%22springer%22+OR+%22elsevier%22%29+AND+language%3A%28%22eng%22%29&size=2&rankBy=qualityOverRelevance&sid=istex-dl&extract=fulltext%5Bpdf%5D",
    );
  });

  it("should correctly build full api url with selected documents", () => {
    const params: Module.BuildFullApiUrlOptions = {
      queryString: "hello",
      selectedFormats: formats.fulltext.pdf,
      size: 2,
      selectedDocuments: ["123", "456"],
    };

    expect(Module.buildFullApiUrl(params).toString()).toBe(
      "https://api.istex.fr/document?q=%28hello%29+AND+id%3A%28%22123%22+OR+%22456%22%29&size=2&rankBy=qualityOverRelevance&sid=istex-dl&extract=fulltext%5Bpdf%5D",
    );
  });

  it("should correctly build full api url with excluded documents", () => {
    const params: Module.BuildFullApiUrlOptions = {
      queryString: "hello",
      selectedFormats: formats.fulltext.pdf,
      size: 2,
      excludedDocuments: ["123", "456"],
    };

    expect(Module.buildFullApiUrl(params).toString()).toBe(
      "https://api.istex.fr/document?q=%28hello%29+AND+%28NOT+id%3A%28%22123%22+OR+%22456%22%29%29&size=2&rankBy=qualityOverRelevance&sid=istex-dl&extract=fulltext%5Bpdf%5D",
    );
  });

  it("should correctly build full api url with filters and selected documents", () => {
    const params: Module.BuildFullApiUrlOptions = {
      queryString: "hello",
      selectedFormats: formats.fulltext.pdf,
      size: 2,
      filters: {
        corpusName: ["springer", "elsevier"],
        language: ["eng"],
      },
      selectedDocuments: ["123", "456"],
    };

    expect(Module.buildFullApiUrl(params).toString()).toBe(
      "https://api.istex.fr/document?q=%28hello%29+AND+corpusName%3A%28%22springer%22+OR+%22elsevier%22%29+AND+language%3A%28%22eng%22%29+AND+id%3A%28%22123%22+OR+%22456%22%29&size=2&rankBy=qualityOverRelevance&sid=istex-dl&extract=fulltext%5Bpdf%5D",
    );
  });

  it("should correctly build full api url with filters and excluded documents", () => {
    const params: Module.BuildFullApiUrlOptions = {
      queryString: "hello",
      selectedFormats: formats.fulltext.pdf,
      size: 2,
      filters: {
        corpusName: ["springer", "elsevier"],
        language: ["eng"],
      },
      excludedDocuments: ["123", "456"],
    };

    expect(Module.buildFullApiUrl(params).toString()).toBe(
      "https://api.istex.fr/document?q=%28hello%29+AND+corpusName%3A%28%22springer%22+OR+%22elsevier%22%29+AND+language%3A%28%22eng%22%29+AND+%28NOT+id%3A%28%22123%22+OR+%22456%22%29%29&size=2&rankBy=qualityOverRelevance&sid=istex-dl&extract=fulltext%5Bpdf%5D",
    );
  });

  it("should correctly set search params sorting with sortBy", () => {
    const searchParams = new URLSearchParams();
    const sortBy = "publicationDate";
    const sortDir = "desc";

    Module.setSearchParamsSorting(searchParams, sortBy, sortDir);

    expect(searchParams.get("sortBy")).toBe("publicationDate[desc]");
  });

  it("should correctly set search params sorting with rankBy", () => {
    const searchParams = new URLSearchParams();
    const sortBy = "qualityOverRelevance";
    const sortDir = "desc";

    Module.setSearchParamsSorting(searchParams, sortBy, sortDir);

    expect(searchParams.get("rankBy")).toBe("qualityOverRelevance");
  });

  it("should correctly build result preview url with sortBy", () => {
    const params: Module.BuildResultPreviewUrlOptions = {
      queryString: "hello",
      sortBy: "publicationDate",
      sortDir: "desc",
    };

    expect(Module.buildResultPreviewUrl(params).toString()).toBe(
      "https://api.istex.fr/document?q=hello&size=10&from=0&sortBy=publicationDate%5Bdesc%5D&output=*&sid=istex-dl&facet=corpusName%5B*%5D%2Clanguage%5B*%5D%2CpublicationDate%2Chost.genre%5B*%5D%2Cgenre%5B*%5D%2Cenrichments.type%5B*%5D%2Ccategories.wos%5B*%5D%2Ccategories.scienceMetrix%5B*%5D%2Ccategories.scopus%5B*%5D%2Ccategories.inist%5B*%5D%2CqualityIndicators.pdfWordCount%2CqualityIndicators.pdfCharCount%2CqualityIndicators.score%2CqualityIndicators.pdfVersion%5B*%5D%2CqualityIndicators.refBibsNative%2CqualityIndicators.abstractCharCount%5B1-1000000%5D%2CqualityIndicators.pdfText%2CqualityIndicators.tdmReady%2CqualityIndicators.teiSource",
    );
  });

  it("should correctly build result preview url with rankBy", () => {
    const params: Module.BuildResultPreviewUrlOptions = {
      queryString: "hello",
      sortBy: "qualityOverRelevance",
    };

    expect(Module.buildResultPreviewUrl(params).toString()).toBe(
      "https://api.istex.fr/document?q=hello&size=10&from=0&rankBy=qualityOverRelevance&output=*&sid=istex-dl&facet=corpusName%5B*%5D%2Clanguage%5B*%5D%2CpublicationDate%2Chost.genre%5B*%5D%2Cgenre%5B*%5D%2Cenrichments.type%5B*%5D%2Ccategories.wos%5B*%5D%2Ccategories.scienceMetrix%5B*%5D%2Ccategories.scopus%5B*%5D%2Ccategories.inist%5B*%5D%2CqualityIndicators.pdfWordCount%2CqualityIndicators.pdfCharCount%2CqualityIndicators.score%2CqualityIndicators.pdfVersion%5B*%5D%2CqualityIndicators.refBibsNative%2CqualityIndicators.abstractCharCount%5B1-1000000%5D%2CqualityIndicators.pdfText%2CqualityIndicators.tdmReady%2CqualityIndicators.teiSource",
    );
  });

  it("should correctly build full api url with sortBy", () => {
    const params: Module.BuildFullApiUrlOptions = {
      queryString: "hello",
      selectedFormats: formats.fulltext.pdf,
      size: 2,
      sortBy: "publicationDate",
      sortDir: "desc",
    };

    expect(Module.buildFullApiUrl(params).toString()).toBe(
      "https://api.istex.fr/document?q=hello&size=2&sortBy=publicationDate%5Bdesc%5D&sid=istex-dl&extract=fulltext%5Bpdf%5D",
    );
  });

  it("should correctly build full api url with rankBy", () => {
    const params: Module.BuildFullApiUrlOptions = {
      queryString: "hello",
      selectedFormats: formats.fulltext.pdf,
      size: 2,
      sortBy: "qualityOverRelevance",
    };

    expect(Module.buildFullApiUrl(params).toString()).toBe(
      "https://api.istex.fr/document?q=hello&size=2&rankBy=qualityOverRelevance&sid=istex-dl&extract=fulltext%5Bpdf%5D",
    );
  });
});
