import {
  MIN_PER_PAGE,
  NO_FORMAT_SELECTED,
  corpusWithExternalFulltextLink,
  formats,
} from "@/config";
import type { AST } from "@/lib/ast";
import * as Module from "@/lib/istexApi";

describe("Istex API related functions", () => {
  describe("createCompleteQuery", () => {
    it("creates a query with selected documents", () => {
      const queryString = "hello";
      const selectedDocuments = [
        { title: "title1", arkIstex: "123" },
        { title: "title2", arkIstex: "456" },
      ];

      expect(
        Module.createCompleteQuery(queryString, undefined, selectedDocuments),
      ).toBe('arkIstex.raw:("123" "456")');
    });

    it("creates a query with excluded documents", () => {
      const queryString = "hello";
      const excludedDocuments = ["123", "456"];

      expect(
        Module.createCompleteQuery(
          queryString,
          undefined,
          undefined,
          excludedDocuments,
        ),
      ).toBe('(hello) AND (NOT arkIstex.raw:("123" "456"))');
    });

    it("creates a query with filters", () => {
      const queryString = "hello";
      const filters: AST = [
        { nodeType: "operator", value: "AND" },
        {
          nodeType: "node",
          field: "publicationDate",
          fieldType: "number",
          min: 2010,
          max: 2020,
          comparator: "between",
        },
      ];

      expect(Module.createCompleteQuery(queryString, filters)).toBe(
        "(hello) AND publicationDate:[2010 TO 2020]",
      );
    });
  });

  describe("setSearchParamsSorting", () => {
    it("sets search params sorting with sortBy", () => {
      const searchParams = new URLSearchParams();
      const sortBy = "publicationDate";
      const sortDir = "desc";

      Module.setSearchParamsSorting(searchParams, sortBy, sortDir);

      expect(searchParams.get("sortBy")).toBe("publicationDate[desc]");
    });

    it("sets search params sorting with rankBy", () => {
      const searchParams = new URLSearchParams();
      const sortBy = "qualityOverRelevance";
      const sortDir = "desc";

      Module.setSearchParamsSorting(searchParams, sortBy, sortDir);

      expect(searchParams.get("rankBy")).toBe("qualityOverRelevance");
    });
  });

  describe("buildResultPreviewUrl", () => {
    it("builds the result preview URL", () => {
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
        "https://api.istex.fr/document?q=hello&size=10&from=0&rankBy=qualityOverRelevance&output=corpusName%2Ctitle%2Cdoi%2CaccessCondition.contentType%2CfulltextUrl%2Chost.title%2Chost.genre%2Cauthor%2Cabstract%2Cgenre%2CpublicationDate%2CarkIstex%2Cfulltext%2Cmetadata%2Cannexes%2Cenrichments&sid=istex-search&facet=corpusName%5B*%5D%2Clanguage%5B*%5D%2CpublicationDate%2Chost.genre%5B*%5D%2Cgenre%5B*%5D%2Cenrichments.type%5B*%5D%2Clanguage%5B*%5D%2Cenrichments.type%5B*%5D%2CqualityIndicators.abstractCharCount%5B1-1000000%5D%2CqualityIndicators.pdfText%2CqualityIndicators.teiSource%5B*%5D%2CqualityIndicators.tdmReady",
      );

      expect(Module.buildResultPreviewUrl(completeParams).toString()).toBe(
        "https://api.istex.fr/document?q=hello&size=10&from=20&rankBy=qualityOverRelevance&output=abstract%2Ctitle&sid=istex-search&facet=corpusName%5B*%5D%2Clanguage%5B*%5D%2CpublicationDate%2Chost.genre%5B*%5D%2Cgenre%5B*%5D%2Cenrichments.type%5B*%5D%2Clanguage%5B*%5D%2Cenrichments.type%5B*%5D%2CqualityIndicators.abstractCharCount%5B1-1000000%5D%2CqualityIndicators.pdfText%2CqualityIndicators.teiSource%5B*%5D%2CqualityIndicators.tdmReady",
      );
    });

    it("builds the result preview URL with sortBy", () => {
      const params: Module.BuildResultPreviewUrlOptions = {
        queryString: "hello",
        sortBy: "publicationDate",
        sortDir: "desc",
      };
      const url = Module.buildResultPreviewUrl(params);

      expect(url.searchParams.get("sortBy")).toBe(
        `${params.sortBy}[${params.sortDir}]`,
      );
    });

    it("builds the result preview URL with rankBy", () => {
      const params: Module.BuildResultPreviewUrlOptions = {
        queryString: "hello",
        sortBy: "qualityOverRelevance",
      };
      const url = Module.buildResultPreviewUrl(params);

      expect(url.searchParams.get("rankBy")).toBe(params.sortBy);
    });

    it("builds the result preview URL with randomSeed", () => {
      const params: Module.BuildResultPreviewUrlOptions = {
        queryString: "hello",
        sortBy: "random",
        randomSeed: "1234",
      };
      const url = Module.buildResultPreviewUrl(params);

      expect(url.searchParams.get("randomSeed")).toBe(params.randomSeed);
    });

    it("builds the result preview URL with stats", () => {
      const params: Module.BuildResultPreviewUrlOptions = {
        queryString: "hello",
        sortBy: "random",
        stats: true,
      };
      const url = Module.buildResultPreviewUrl(params);

      expect(url.searchParams.get("stats")).not.toBeNull();
    });

    it("builds the result preview URL with selected documents", () => {
      const params: Module.BuildResultPreviewUrlOptions = {
        queryString: "hello",
        selectedDocuments: [
          { title: "title1", arkIstex: "123" },
          { title: "title2", arkIstex: "456" },
        ],
      };
      const url = Module.buildResultPreviewUrl(params);

      expect(url.searchParams.get("q")).toBe('arkIstex.raw:("123" "456")');
    });

    it("builds the result preview URL with excluded documents", () => {
      const params: Module.BuildResultPreviewUrlOptions = {
        queryString: "hello",
        excludedDocuments: ["123", "456"],
      };
      const url = Module.buildResultPreviewUrl(params);

      expect(url.searchParams.get("q")).toBe(
        '(hello) AND (NOT arkIstex.raw:("123" "456"))',
      );
    });
  });

  describe("buildFullApiUrl", () => {
    it("builds the full API URL", () => {
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
        "https://api.istex.fr/document?q=hello&size=2&rankBy=qualityOverRelevance&sid=istex-search&extract=fulltext%5Bpdf%5D",
      );

      expect(Module.buildFullApiUrl(noSelectFormatsParams).toString()).toBe(
        "https://api.istex.fr/document?q=hello&size=2&rankBy=qualityOverRelevance&sid=istex-search",
      );
    });

    it("builds the full API URL with selected documents", () => {
      const params: Module.BuildFullApiUrlOptions = {
        queryString: "hello",
        selectedFormats: formats.fulltext.pdf,
        size: 2,
        selectedDocuments: [
          { title: "title1", arkIstex: "123" },
          { title: "title2", arkIstex: "456" },
        ],
      };
      const url = Module.buildFullApiUrl(params);

      expect(url.searchParams.get("q")).toBe('arkIstex.raw:("123" "456")');
    });

    it("builds the full API URL with excluded documents", () => {
      const params: Module.BuildFullApiUrlOptions = {
        queryString: "hello",
        selectedFormats: formats.fulltext.pdf,
        size: 2,
        excludedDocuments: ["123", "456"],
      };
      const url = Module.buildFullApiUrl(params);

      expect(url.searchParams.get("q")).toBe(
        '(hello) AND (NOT arkIstex.raw:("123" "456"))',
      );
    });

    it("builds the full API URL with sortBy", () => {
      const params: Module.BuildFullApiUrlOptions = {
        queryString: "hello",
        selectedFormats: formats.fulltext.pdf,
        size: 2,
        sortBy: "publicationDate",
        sortDir: "desc",
      };
      const url = Module.buildFullApiUrl(params);

      expect(url.searchParams.get("sortBy")).toBe(
        `${params.sortBy}[${params.sortDir}]`,
      );
    });

    it("builds the full API URL with rankBy", () => {
      const params: Module.BuildFullApiUrlOptions = {
        queryString: "hello",
        selectedFormats: formats.fulltext.pdf,
        size: 2,
        sortBy: "qualityOverRelevance",
      };
      const url = Module.buildFullApiUrl(params);

      expect(url.searchParams.get("rankBy")).toBe(params.sortBy);
    });

    it("builds the full API URL with randomSeed", () => {
      const params: Module.BuildFullApiUrlOptions = {
        queryString: "hello",
        selectedFormats: formats.fulltext.pdf,
        size: 2,
        sortBy: "random",
        randomSeed: "1234",
      };
      const url = Module.buildFullApiUrl(params);

      expect(url.searchParams.get("randomSeed")).toBe(params.randomSeed);
    });

    it("builds the full API URL with archiveType", () => {
      const params: Module.BuildFullApiUrlOptions = {
        queryString: "hello",
        selectedFormats: formats.fulltext.pdf,
        size: 2,
        archiveType: "tar",
      };
      const url = Module.buildFullApiUrl(params);

      expect(url.searchParams.get("archiveType")).toBe(params.archiveType);
    });

    it("builds the full API URL with compressionLevel", () => {
      const params: Module.BuildFullApiUrlOptions = {
        queryString: "hello",
        selectedFormats: formats.fulltext.pdf,
        size: 2,
        compressionLevel: 9,
      };
      const url = Module.buildFullApiUrl(params);

      expect(url.searchParams.get("compressionLevel")).toBe(
        params.compressionLevel?.toString(),
      );
    });
  });

  describe("getExternalPdfUrl", () => {
    const document: Module.Result = {
      id: "123",
      corpusName: "Corpus name",
      arkIstex: "arkIstex",
      doi: ["doi"],
      fulltextUrl: "https://foo.bar/",
    };

    it("returns null when the corpus name is not one of corpusWithExternalFulltextLink", () => {
      const url = Module.getExternalPdfUrl({
        ...document,
        corpusName: "hello",
      });

      expect(url).toBe(null);
    });

    it("returns null when the corpus name is one of corpusWithExternalFulltextLink but DOI and fulltextUrl are not defined", () => {
      const url = Module.getExternalPdfUrl({
        ...document,
        corpusName: corpusWithExternalFulltextLink[0],
        doi: undefined,
        fulltextUrl: undefined,
      });

      expect(url).toBe(null);
    });

    it("returns an URL based on the DOI when the corpus name is one corpusWithExternalFulltextLink and a DOI is present", () => {
      const url = Module.getExternalPdfUrl({
        ...document,
        corpusName: corpusWithExternalFulltextLink[0],
        doi: ["my-doi"],
        fulltextUrl: undefined,
      });

      expect(url?.href).toBe("https://doi.org/my-doi");
    });

    it("returns an URL based on the fulltextUrl when the corpus name is one corpusWithExternalFulltextLink but DOI is not defined", () => {
      const url = Module.getExternalPdfUrl({
        ...document,
        corpusName: corpusWithExternalFulltextLink[0],
        doi: undefined,
        fulltextUrl: "https://example.com/",
      });

      expect(url?.href).toBe("https://example.com/");
    });
  });
});
