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
      "https://api.istex.fr/document?q=hello&size=10&from=0&output=*&sid=istex-dl&facet=corpusName%5B*%5D%2Clanguage%5B*%5D%2CpublicationDate%2Chost.genre%5B*%5D%2Cgenre%5B*%5D%2Cenrichments.type%5B*%5D%2Ccategories.wos%5B*%5D%2Ccategories.scienceMetrix%5B*%5D%2Ccategories.scopus%5B*%5D%2Ccategories.inist%5B*%5D%2CqualityIndicators.pdfWordCount%2CqualityIndicators.pdfCharCount%2CqualityIndicators.score%2CqualityIndicators.pdfVersion%5B*%5D%2CqualityIndicators.refBibsNative%2CqualityIndicators.abstractCharCount%5B1-1000000%5D%2CqualityIndicators.pdfText%2CqualityIndicators.tdmReady%2CqualityIndicators.teiSource",
    );

    expect(Module.buildResultPreviewUrl(completeParams).toString()).toBe(
      "https://api.istex.fr/document?q=hello&size=10&from=20&output=abstract%2Ctitle&sid=istex-dl&facet=corpusName%5B*%5D%2Clanguage%5B*%5D%2CpublicationDate%2Chost.genre%5B*%5D%2Cgenre%5B*%5D%2Cenrichments.type%5B*%5D%2Ccategories.wos%5B*%5D%2Ccategories.scienceMetrix%5B*%5D%2Ccategories.scopus%5B*%5D%2Ccategories.inist%5B*%5D%2CqualityIndicators.pdfWordCount%2CqualityIndicators.pdfCharCount%2CqualityIndicators.score%2CqualityIndicators.pdfVersion%5B*%5D%2CqualityIndicators.refBibsNative%2CqualityIndicators.abstractCharCount%5B1-1000000%5D%2CqualityIndicators.pdfText%2CqualityIndicators.tdmReady%2CqualityIndicators.teiSource",
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
      "https://api.istex.fr/document?q=hello&size=2&sid=istex-dl&extract=fulltext%5Bpdf%5D",
    );

    expect(Module.buildFullApiUrl(noSelectFormatsParams).toString()).toBe(
      "https://api.istex.fr/document?q=hello&size=2&sid=istex-dl",
    );
  });

  it("should correctly merge filters to query string", () => {
    const queryString = "hello";
    const filters: Module.Filter = {
      corpusName: ["springer", "elsevier"],
      language: ["eng"],
      genre: ["article", "book"],
    };

    expect(Module.mergeFiltersToQueryString(queryString, filters)).toBe(
      '(hello) AND corpusName:("springer" OR "elsevier") AND language:("eng") AND genre:("article" OR "book")',
    );
  });

  it("should correctly merge filters with NOT to query string", () => {
    const queryString = "hello";
    const filters: Module.Filter = {
      corpusName: ["springer", "!elsevier"],
      language: ["eng"],
      genre: ["article", "book"],
    };

    expect(Module.mergeFiltersToQueryString(queryString, filters)).toBe(
      '(hello) AND corpusName:("springer" NOT "elsevier") AND language:("eng") AND genre:("article" OR "book")',
    );
  });

  it("should correctly merge filters with NOT and range values to query string", () => {
    const queryString = "hello";
    const filters: Module.Filter = {
      corpusName: ["springer", "elsevier"],
      language: ["eng"],
      genre: ["article", "book"],
      publicationDate: ["!2010-2020"],
    };

    expect(Module.mergeFiltersToQueryString(queryString, filters)).toBe(
      '(hello) AND corpusName:("springer" OR "elsevier") AND language:("eng") AND genre:("article" OR "book") AND (NOT publicationDate:[2010 TO 2020])',
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
      "https://api.istex.fr/document?q=%28hello%29+AND+corpusName%3A%28%22springer%22+OR+%22elsevier%22%29+AND+language%3A%28%22eng%22%29&size=10&from=0&output=*&sid=istex-dl&facet=corpusName%5B*%5D%2Clanguage%5B*%5D%2CpublicationDate%2Chost.genre%5B*%5D%2Cgenre%5B*%5D%2Cenrichments.type%5B*%5D%2Ccategories.wos%5B*%5D%2Ccategories.scienceMetrix%5B*%5D%2Ccategories.scopus%5B*%5D%2Ccategories.inist%5B*%5D%2CqualityIndicators.pdfWordCount%2CqualityIndicators.pdfCharCount%2CqualityIndicators.score%2CqualityIndicators.pdfVersion%5B*%5D%2CqualityIndicators.refBibsNative%2CqualityIndicators.abstractCharCount%5B1-1000000%5D%2CqualityIndicators.pdfText%2CqualityIndicators.tdmReady%2CqualityIndicators.teiSource",
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
      "https://api.istex.fr/document?q=%28hello%29+AND+corpusName%3A%28%22springer%22+OR+%22elsevier%22%29+AND+language%3A%28%22eng%22%29&size=2&sid=istex-dl&extract=fulltext%5Bpdf%5D",
    );
  });
});
