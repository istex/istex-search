import {
  DEFAULT_ARCHIVE_TYPE,
  DEFAULT_COMPRESSION_LEVEL,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_DIR,
  DEFAULT_USAGE_NAME,
  MAX_PER_PAGE,
  MIN_PER_PAGE,
  NO_FORMAT_SELECTED,
  SEARCH_MODE_ASSISTED,
  SEARCH_MODE_IMPORT,
  SEARCH_MODE_REGULAR,
  formats,
  istexApiConfig,
  perPageOptions,
} from "@/config";
import CustomError from "@/lib/CustomError";
import SearchParams from "@/lib/SearchParams";
import { getEmptyAst, type AST } from "@/lib/assistedSearch/ast";

describe("SearchParams class", () => {
  describe("getQueryString", () => {
    it("gets the query string", async () => {
      const searchParams = new SearchParams({ q: "hello" });

      expect(await searchParams.getQueryString()).toBe("hello");
    });

    it("throws an error when there is an invalid q_id", () => {
      const qId = "invalid";
      const searchParams = new SearchParams({ q_id: qId });

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      expect(searchParams.getQueryString()).rejects.toEqual(
        new CustomError({ name: "QIdNotFoundError", qId }),
      );
    });
  });

  describe("setQueryString", () => {
    it("sets the query string", async () => {
      const searchParams = new SearchParams({ q: "hello" });

      await searchParams.setQueryString("world");
      expect(await searchParams.getQueryString()).toBe("world");
    });
  });

  describe("deleteQueryString", () => {
    it("deletes the query string", async () => {
      const searchParams = new SearchParams({ q: "hello" });

      searchParams.deleteQueryString();
      expect(await searchParams.getQueryString()).toBe("");
    });
  });

  describe("getFormats", () => {
    it("gets the formats", () => {
      const validSearchParams = new SearchParams({ extract: "fulltext[pdf]" });

      expect(validSearchParams.getFormats()).toBe(formats.fulltext.pdf);
    });

    it("returns NO_FORMAT_SELECTED when the extract parameter is invalid", () => {
      const invalidSearchParams = new SearchParams({ extract: "hello" });

      expect(invalidSearchParams.getFormats()).toBe(NO_FORMAT_SELECTED);
    });
  });

  describe("setFormats", () => {
    it("sets the formats", () => {
      const searchParams = new SearchParams({ extract: "fulltext[pdf]" });

      searchParams.setFormats(formats.metadata.json);
      expect(searchParams.getFormats()).toBe(formats.metadata.json);
    });
  });

  describe("deleteFormats", () => {
    it("deletes the formats", () => {
      const searchParams = new SearchParams({ extract: "fulltext[pdf]" });

      searchParams.deleteFormats();
      expect(searchParams.getFormats()).toBe(NO_FORMAT_SELECTED);
    });
  });

  describe("getUsageName", () => {
    it("gets the usage name", () => {
      const validSearchParams = new SearchParams({ usage: "lodex" });

      expect(validSearchParams.getUsageName()).toBe("lodex");
    });

    it("returns the default usage name if the usage parameter is invalid", () => {
      const invalidSearchParams = new SearchParams({ usage: "hello" });

      expect(invalidSearchParams.getUsageName()).toBe(DEFAULT_USAGE_NAME);
    });
  });

  describe("setUsageName", () => {
    it("sets the usage name", () => {
      const searchParams = new SearchParams({ usage: "lodex" });

      searchParams.setUsageName("custom");
      expect(searchParams.getUsageName()).toBe("custom");
    });
  });

  describe("deleteUsageName", () => {
    it("deletes the usage name", () => {
      const searchParams = new SearchParams({ usage: "lodex" });

      searchParams.deleteUsageName();
      expect(searchParams.getUsageName()).toBe(DEFAULT_USAGE_NAME);
    });
  });

  describe("getSize", () => {
    it("gets the size", () => {
      const validSearchParams = new SearchParams({ size: "2" });

      expect(validSearchParams.getSize()).toBe(2);
    });

    it("returns 0 when the size parameter is not a number", () => {
      const invalidSearchParams = new SearchParams({ size: "hello" });

      expect(invalidSearchParams.getSize()).toBe(0);
    });

    it("returns the max allowed when the size parameter is too big", () => {
      const tooBig = new SearchParams({
        size: (istexApiConfig.maxSize + 2).toString(),
      });

      expect(tooBig.getSize()).toBe(istexApiConfig.maxSize);
    });

    it("returns 0 whe the size parameter is negative", () => {
      const tooSmall = new SearchParams({ size: "-1" });

      expect(tooSmall.getSize()).toBe(0);
    });

    it("rounds to the closest integer when the size parameter is a decimal number", () => {
      const decimalRoundDown = new SearchParams({ size: "1.2" });
      const decimalRowndUp = new SearchParams({ size: "1.7" });

      expect(decimalRoundDown.getSize()).toBe(1);
      expect(decimalRowndUp.getSize()).toBe(2);
    });
  });

  describe("setSize", () => {
    const searchParams = new SearchParams({ size: "2" });

    it("sets the size", () => {
      searchParams.setSize(3);
      expect(searchParams.getSize()).toBe(3);
    });

    it("sets the size to the max allowed when size is too big", () => {
      searchParams.setSize(istexApiConfig.maxSize + 2);
      expect(searchParams.getSize()).toBe(istexApiConfig.maxSize);
    });

    it("sets the size to 0 when the size is negative", () => {
      searchParams.setSize(-1);
      expect(searchParams.getSize()).toBe(0);
    });

    it("sets the size to the closest integer when size is a decimal number", () => {
      searchParams.setSize(1.2);
      expect(searchParams.getSize()).toBe(1);

      searchParams.setSize(1.7);
      expect(searchParams.getSize()).toBe(2);
    });
  });

  describe("deleteSize", () => {
    it("deletes the size", () => {
      const searchParams = new SearchParams({ size: "2" });

      searchParams.deleteSize();
      expect(searchParams.getSize()).toBe(0);
    });
  });

  describe("getPage", () => {
    const perPage = MIN_PER_PAGE;
    const minPage = 1;
    const maxPage = Math.ceil(istexApiConfig.maxPaginationOffset / perPage);

    it("gets the page", () => {
      const validSearchParams = new SearchParams({
        page: "2",
        perPage: perPage.toString(),
      });

      expect(validSearchParams.getPage()).toBe(2);
    });

    it("returns the first page when the page parameter is not a number", () => {
      const invalidSearchParams = new SearchParams({ page: "hello" });

      expect(invalidSearchParams.getPage()).toBe(minPage);
    });

    it("returns the last page when the page parameter is too big", () => {
      const tooBig = new SearchParams({
        page: (maxPage + 2).toString(),
      });

      expect(tooBig.getPage()).toBe(maxPage);
    });

    it("returns the first page when the page parameter is negative", () => {
      const tooSmall = new SearchParams({ page: "-1" });

      expect(tooSmall.getPage()).toBe(minPage);
    });

    it("returns the closest integer when the page parameter is a decimal number", () => {
      const decimalRoundDown = new SearchParams({ page: "1.2" });
      expect(decimalRoundDown.getPage()).toBe(1);

      const decimalRowndUp = new SearchParams({ page: "1.7" });
      expect(decimalRowndUp.getPage()).toBe(2);
    });
  });

  describe("setPage", () => {
    const perPage = MIN_PER_PAGE;
    const minPage = 1;
    const maxPage = Math.ceil(istexApiConfig.maxPaginationOffset / perPage);
    const searchParams = new SearchParams({
      page: "2",
      perPage: perPage.toString(),
    });

    it("sets the page", () => {
      searchParams.setPage(3);
      expect(searchParams.getPage()).toBe(3);
    });

    it("sets the page to the last page when page is too big", () => {
      searchParams.setPage(maxPage + 2);
      expect(searchParams.getPage()).toBe(maxPage);
    });

    it("sets the page to the first page when page is negative", () => {
      searchParams.setPage(-1);
      expect(searchParams.getPage()).toBe(minPage);
    });

    it("sets the page to the closest integer when page is a decimal number", () => {
      searchParams.setPage(1.2);
      expect(searchParams.getPage()).toBe(1);

      searchParams.setPage(1.7);
      expect(searchParams.getPage()).toBe(2);
    });
  });

  describe("deletePage", () => {
    it("deletes the page", () => {
      const minPage = 1;
      const searchParams = new SearchParams({ page: "2" });

      searchParams.deletePage();
      expect(searchParams.getPage()).toBe(minPage);
    });
  });

  describe("getPerPage", () => {
    it("gets the per page", () => {
      const validSearchParams = new SearchParams({
        perPage: perPageOptions[1].toString(),
      });

      expect(validSearchParams.getPerPage()).toBe(perPageOptions[1]);
    });

    it("returns the min per page when the perPage parameter is not a number", () => {
      const invalidSearchParams = new SearchParams({ perPage: "hello" });

      expect(invalidSearchParams.getPerPage()).toBe(MIN_PER_PAGE);
    });

    it("returns the max per page when the perPage parameter is too big", () => {
      const tooBig = new SearchParams({
        perPage: (MAX_PER_PAGE + 2).toString(),
      });

      expect(tooBig.getPerPage()).toBe(MAX_PER_PAGE);
    });

    it("returns the min per page when the perPage parameter is too small", () => {
      const tooSmall = new SearchParams({
        perPage: (MIN_PER_PAGE - 2).toString(),
      });

      expect(tooSmall.getPerPage()).toBe(MIN_PER_PAGE);
    });

    it("returns the closest per page option when the perPage parameter is between min and max but not a valid value", () => {
      const inBetween = new SearchParams({
        perPage: (perPageOptions[1] + 2).toString(),
      });

      expect(inBetween.getPerPage()).toBe(perPageOptions[1]);
    });
  });

  describe("setPerPage", () => {
    it("sets the per page", () => {
      const searchParams = new SearchParams({
        perPage: MIN_PER_PAGE.toString(),
      });

      searchParams.setPerPage(perPageOptions[1]);
      expect(searchParams.getPerPage()).toBe(perPageOptions[1]);
    });
  });

  describe("deletePerPage", () => {
    it("deletes the per page", () => {
      const searchParams = new SearchParams({
        perPage: MAX_PER_PAGE.toString(),
      });

      searchParams.deletePerPage();
      expect(searchParams.getPerPage()).toBe(MIN_PER_PAGE);
    });
  });

  describe("getFilters", () => {
    it("gets the filters", () => {
      const searchParams = new SearchParams({
        filter: '{"language":["fre","eng"]}',
      });

      expect(searchParams.getFilters()).toEqual({
        language: ["fre", "eng"],
      });
    });
  });

  describe("setFilters", () => {
    it("sets the filters", () => {
      const searchParams = new SearchParams({});
      searchParams.setFilters({
        language: ["fre", "eng"],
      });

      expect(searchParams.getFilters()).toEqual({
        language: ["fre", "eng"],
      });
    });
  });

  describe("deleteFilters", () => {
    it("deletes the filters", () => {
      const searchParams = new SearchParams({
        filter: '{"language":["fre","eng"]}',
      });

      searchParams.deleteFilters();

      expect(searchParams.getFilters()).toEqual({});
    });
  });

  describe("getSearchMode", () => {
    it("gets the search mode", () => {
      const searchParams = new SearchParams({
        searchMode: SEARCH_MODE_IMPORT,
      });

      expect(searchParams.getSearchMode()).toBe(SEARCH_MODE_IMPORT);
    });

    it("returns the default search mode when the searchMode parameter is invalid", () => {
      const searchParams = new SearchParams({
        searchMode: "hello",
      });

      expect(searchParams.getSearchMode()).toBe(SEARCH_MODE_REGULAR);
    });
  });

  describe("setSearchMode", () => {
    it("sets the search mode", () => {
      const searchParams = new SearchParams({});

      searchParams.setSearchMode(SEARCH_MODE_ASSISTED);

      expect(searchParams.getSearchMode()).toBe(SEARCH_MODE_ASSISTED);
    });
  });

  describe("deleteSearchMode", () => {
    it("deletes the search mode", () => {
      const searchParams = new SearchParams({
        searchMode: SEARCH_MODE_ASSISTED,
      });

      searchParams.deleteSearchMode();

      expect(searchParams.getSearchMode()).toBe(SEARCH_MODE_REGULAR);
    });
  });

  describe("getAst", () => {
    it("gets the AST", () => {
      const ast: AST = [
        {
          nodeType: "node",
          fieldType: "text",
          field: "abstract",
          value: "foo",
          comparator: "equals",
        },
      ];
      const searchParams = new SearchParams({
        ast: btoa(JSON.stringify(ast)),
      });

      expect(searchParams.getAst()).toEqual(ast);
    });
  });

  describe("setAst", () => {
    it("sets the AST", () => {
      const ast: AST = [
        {
          nodeType: "node",
          fieldType: "text",
          field: "abstract",
          value: "foo",
          comparator: "equals",
        },
      ];
      const searchParams = new SearchParams({});

      searchParams.setAst(ast);

      expect(searchParams.getAst()).toEqual(ast);
    });
  });

  describe("deleteAst", () => {
    it("deletes the AST", () => {
      const ast: AST = [
        {
          nodeType: "node",
          fieldType: "text",
          field: "abstract",
          value: "foo",
          comparator: "equals",
        },
      ];
      const searchParams = new SearchParams({
        ast: btoa(JSON.stringify(ast)),
      });

      searchParams.deleteAst();

      expect(searchParams.getAst()).toEqual(getEmptyAst());
    });
  });

  describe("getSortBy", () => {
    it("gets the sort by", () => {
      const searchParams = new SearchParams({
        sortBy: "publicationDate",
      });

      expect(searchParams.getSortBy()).toBe("publicationDate");
    });

    it("returns the default sort by when the sortBy parameter is invalid", () => {
      const searchParams = new SearchParams({
        sortBy: "hello",
      });

      expect(searchParams.getSortBy()).toBe("qualityOverRelevance");
    });
  });

  describe("setSortBy", () => {
    it("sets the sort by", () => {
      const searchParams = new SearchParams({});

      searchParams.setSortBy("publicationDate");

      expect(searchParams.getSortBy()).toBe("publicationDate");
    });
  });

  describe("deleteSortBy", () => {
    it("deletes the sort by", () => {
      const searchParams = new SearchParams({
        sortBy: "publicationDate",
      });

      searchParams.deleteSortBy();

      expect(searchParams.getSortBy()).toBe(DEFAULT_SORT_BY);
    });
  });

  describe("getSortDirection", () => {
    it("gets the sort direction", () => {
      const searchParams = new SearchParams({
        sortDirection: "desc",
      });

      expect(searchParams.getSortDirection()).toBe("desc");
    });

    it("returns the default sort direction when the sortDirection parameter is invalid", () => {
      const searchParams = new SearchParams({
        sortDirection: "hello",
      });

      expect(searchParams.getSortDirection()).toBe("asc");
    });
  });

  describe("setSortDirection", () => {
    it("sets the sort direction", () => {
      const searchParams = new SearchParams({});

      searchParams.setSortDirection("asc");

      expect(searchParams.getSortDirection()).toBe("asc");
    });
  });

  describe("deleteSortDirection", () => {
    it("deletes the sort direction", () => {
      const searchParams = new SearchParams({
        sortDirection: "desc",
      });

      searchParams.deleteSortDirection();

      expect(searchParams.getSortDirection()).toBe(DEFAULT_SORT_DIR);
    });
  });

  describe("getRandomSeed", () => {
    it("gets the random seed", () => {
      const randomSeed = "veryRandomSeed";
      const searchParams = new SearchParams({
        randomSeed,
      });

      expect(searchParams.getRandomSeed()).toBe(randomSeed);
    });
  });

  describe("setRandomSeed", () => {
    it("sets the random seed", () => {
      const randomSeed = "veryRandomSeed";
      const searchParams = new SearchParams({});

      searchParams.setRandomSeed(randomSeed);

      expect(searchParams.getRandomSeed()).toBe(randomSeed);
    });
  });

  describe("deleteRandomSeed", () => {
    it("deletes the random seed", () => {
      const searchParams = new SearchParams({
        randomSeed: "veryRandomSeed",
      });

      searchParams.deleteRandomSeed();

      expect(searchParams.getRandomSeed()).toBe(undefined);
    });
  });

  describe("getArchiveType", () => {
    it("gets the archive type", () => {
      const searchParams = new SearchParams({
        archiveType: "tar",
      });

      expect(searchParams.getArchiveType()).toBe("tar");
    });

    it("returns the default archive type when the archiveType parameter is invalid", () => {
      const searchParams = new SearchParams({
        archiveType: "hello",
      });

      expect(searchParams.getArchiveType()).toBe("zip");
    });

    it("returns the first archive type supported by the usage when the archiveType parameter isn't supported by the usage", () => {
      const searchParams = new SearchParams({
        archiveType: "tar",
        usage: "cortext",
      });

      expect(searchParams.getArchiveType()).toBe("zip");
    });
  });

  describe("setArchiveType", () => {
    it("sets the archive type", () => {
      const searchParams = new SearchParams({});

      searchParams.setArchiveType("tar");

      expect(searchParams.getArchiveType()).toBe("tar");
    });
  });

  describe("deleteArchiveType", () => {
    it("deletes the archive type", () => {
      const searchParams = new SearchParams({
        archiveType: "tar",
      });

      searchParams.deleteArchiveType();

      expect(searchParams.getArchiveType()).toBe(DEFAULT_ARCHIVE_TYPE);
    });
  });

  describe("getCompressionLevel", () => {
    it("gets the compression level", () => {
      const searchParams = new SearchParams({
        compressionLevel: "9",
      });

      expect(searchParams.getCompressionLevel()).toBe(9);
    });

    it("returns the default compression level when the compressionLevel parameter is invalid", () => {
      const searchParams = new SearchParams({
        compressionLevel: "hello",
      });

      expect(searchParams.getCompressionLevel()).toBe(
        DEFAULT_COMPRESSION_LEVEL,
      );
    });
  });

  describe("setCompressionLevel", () => {
    it("sets the compression level", () => {
      const searchParams = new SearchParams({});

      searchParams.setCompressionLevel(9);

      expect(searchParams.getCompressionLevel()).toBe(9);
    });
  });

  describe("deleteCompressionLevel", () => {
    it("deletes the compression level", () => {
      const searchParams = new SearchParams({
        archiveType: "9",
      });

      searchParams.deleteCompressionLevel();

      expect(searchParams.getCompressionLevel()).toBe(
        DEFAULT_COMPRESSION_LEVEL,
      );
    });
  });

  describe("clear", () => {
    it("clears the search parameters", async () => {
      const searchParams = new SearchParams({
        q: "hello",
        extract: "metadata[json]",
        size: "2",
        usage: "lodex",
        filters: '{"language":["fre","eng"]}',
      });

      searchParams.clear();

      expect(await searchParams.getQueryString()).toBe("");
      expect(searchParams.getSize()).toBe(0);
      expect(searchParams.getUsageName()).toBe(DEFAULT_USAGE_NAME);
      expect(searchParams.getFormats()).toBe(NO_FORMAT_SELECTED);
      expect(searchParams.getFilters()).toEqual({});
    });
  });

  // Make Math.random always return the same value to avoid mismatches in node IDs when testing
  beforeAll(() => {
    jest.spyOn(Math, "random").mockReturnValue(0);
  });
  afterAll(() => {
    jest.spyOn(Math, "random").mockRestore();
  });
});
