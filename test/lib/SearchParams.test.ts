import {
  DEFAULT_ARCHIVE_TYPE,
  DEFAULT_COMPRESSION_LEVEL,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_DIR,
  DEFAULT_USAGE_NAME,
  formats,
  istexApiConfig,
  MAX_PER_PAGE,
  MIN_PER_PAGE,
  NO_FORMAT_SELECTED,
  perPageOptions,
  SEARCH_MODE_ASSISTED,
  SEARCH_MODE_IMPORT,
  SEARCH_MODE_REGULAR,
} from "@/config";
import { type AST, getEmptyAst } from "@/lib/ast";
import CustomError from "@/lib/CustomError";
import SearchParams from "@/lib/SearchParams";

describe("SearchParams", () => {
  describe("getQueryString", () => {
    it("gets the query string", async () => {
      const searchParams = new SearchParams({ q: "hello" });

      expect(await searchParams.getQueryString()).toBe("hello");
    });

    it("trims the query string", async () => {
      const searchParams = new SearchParams({ q: "  hello   " });

      expect(await searchParams.getQueryString()).toBe("hello");
    });

    it("throws an error when there is an invalid q_id", () => {
      const qId = "invalid";
      const searchParams = new SearchParams({ q_id: qId });

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

    it("trims the query string", async () => {
      const searchParams = new SearchParams({ q: "hello" });

      await searchParams.setQueryString("  world   ");
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

  describe("getPrompt", () => {
    it("gets the prompt", () => {
      const searchParams = new SearchParams({ prompt: "my prompt" });

      expect(searchParams.getPrompt()).toBe("my prompt");
    });

    it("trims the prompt", () => {
      const searchParams = new SearchParams({ prompt: "  my prompt   " });

      expect(searchParams.getPrompt()).toBe("my prompt");
    });

    it("returns an empty string when the prompt parameter is missing", () => {
      const searchParams = new SearchParams({});

      expect(searchParams.getPrompt()).toBe("");
    });
  });

  describe("setPrompt", () => {
    it("sets the prompt", () => {
      const searchParams = new SearchParams({ prompt: "my prompt" });

      searchParams.setPrompt("my new prompt");
      expect(searchParams.getPrompt()).toBe("my new prompt");
    });

    it("trims the prompt", () => {
      const searchParams = new SearchParams({ prompt: "my prompt" });

      searchParams.setPrompt("  my new prompt   ");
      expect(searchParams.getPrompt()).toBe("my new prompt");
    });
  });

  describe("deletePrompt", () => {
    it("deletes the prompt", () => {
      const searchParams = new SearchParams({ prompt: "my prompt" });

      searchParams.deletePrompt();
      expect(searchParams.getPrompt()).toBe("");
    });
  });

  describe("getFormats", () => {
    it("gets the formats", () => {
      const searchParams = new SearchParams({ extract: "fulltext[pdf]" });

      expect(searchParams.getFormats()).toBe(formats.fulltext.pdf);
    });

    it("returns NO_FORMAT_SELECTED when the extract parameter is invalid", () => {
      const searchParams = new SearchParams({ extract: "hello" });

      expect(searchParams.getFormats()).toBe(NO_FORMAT_SELECTED);
    });

    it("returns NO_FORMAT_SELECTED when the extract parameter is missing", () => {
      const searchParams = new SearchParams({});

      expect(searchParams.getFormats()).toBe(NO_FORMAT_SELECTED);
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
      const searchParams = new SearchParams({ usage: "lodex" });

      expect(searchParams.getUsageName()).toBe("lodex");
    });

    it("returns the default usage name if the usage parameter is invalid", () => {
      const searchParams = new SearchParams({ usage: "hello" });

      expect(searchParams.getUsageName()).toBe(DEFAULT_USAGE_NAME);
    });

    it("returns the default usage name if the usage parameter is missing", () => {
      const searchParams = new SearchParams({});

      expect(searchParams.getUsageName()).toBe(DEFAULT_USAGE_NAME);
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
      const searchParams = new SearchParams({ size: "2" });

      expect(searchParams.getSize()).toBe(2);
    });

    it("returns 0 when the size parameter is not a number", () => {
      const searchParams = new SearchParams({ size: "hello" });

      expect(searchParams.getSize()).toBe(0);
    });

    it("returns the max allowed when the size parameter is too big", () => {
      const searchParams = new SearchParams({
        size: (istexApiConfig.maxSize + 2).toString(),
      });

      expect(searchParams.getSize()).toBe(istexApiConfig.maxSize);
    });

    it("returns 0 when the size parameter is negative", () => {
      const searchParams = new SearchParams({ size: "-1" });

      expect(searchParams.getSize()).toBe(0);
    });

    it("rounds to the closest integer when the size parameter is a decimal number", () => {
      const decimalRoundDown = new SearchParams({ size: "1.2" });
      const decimalRowndUp = new SearchParams({ size: "1.7" });

      expect(decimalRoundDown.getSize()).toBe(1);
      expect(decimalRowndUp.getSize()).toBe(2);
    });

    it("returns 0 when the size parameter is missing", () => {
      const searchParams = new SearchParams({});

      expect(searchParams.getSize()).toBe(0);
    });
  });

  describe("setSize", () => {
    it("sets the size", () => {
      const searchParams = new SearchParams({ size: "2" });

      searchParams.setSize(3);
      expect(searchParams.getSize()).toBe(3);
    });

    it("sets the size to the max allowed when size is too big", () => {
      const searchParams = new SearchParams({ size: "2" });

      searchParams.setSize(istexApiConfig.maxSize + 2);
      expect(searchParams.getSize()).toBe(istexApiConfig.maxSize);
    });

    it("sets the size to 0 when the size is negative", () => {
      const searchParams = new SearchParams({ size: "2" });

      searchParams.setSize(-1);
      expect(searchParams.getSize()).toBe(0);
    });

    it("sets the size to the closest integer when size is a decimal number", () => {
      const searchParams = new SearchParams({ size: "2" });

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
      const searchParams = new SearchParams({
        page: "2",
        perPage: perPage.toString(),
      });

      expect(searchParams.getPage()).toBe(2);
    });

    it("returns the first page when the page parameter is not a number", () => {
      const searchParams = new SearchParams({ page: "hello" });

      expect(searchParams.getPage()).toBe(minPage);
    });

    it("returns the last page when the page parameter is too big", () => {
      const searchParams = new SearchParams({
        page: (maxPage + 2).toString(),
      });

      expect(searchParams.getPage()).toBe(maxPage);
    });

    it("returns the first page when the page parameter is negative", () => {
      const searchParams = new SearchParams({ page: "-1" });

      expect(searchParams.getPage()).toBe(minPage);
    });

    it("returns the closest integer when the page parameter is a decimal number", () => {
      const decimalRoundDown = new SearchParams({ page: "1.2" });
      expect(decimalRoundDown.getPage()).toBe(1);

      const decimalRowndUp = new SearchParams({ page: "1.7" });
      expect(decimalRowndUp.getPage()).toBe(2);
    });

    it("returns the first page when the page parameter is missing", () => {
      const searchParams = new SearchParams({});

      expect(searchParams.getPage()).toBe(minPage);
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
      const searchParams = new SearchParams({
        perPage: perPageOptions[1].toString(),
      });

      expect(searchParams.getPerPage()).toBe(perPageOptions[1]);
    });

    it("returns the min per page when the perPage parameter is not a number", () => {
      const searchParams = new SearchParams({ perPage: "hello" });

      expect(searchParams.getPerPage()).toBe(MIN_PER_PAGE);
    });

    it("returns the max per page when the perPage parameter is too big", () => {
      const searchParams = new SearchParams({
        perPage: (MAX_PER_PAGE + 2).toString(),
      });

      expect(searchParams.getPerPage()).toBe(MAX_PER_PAGE);
    });

    it("returns the min per page when the perPage parameter is too small", () => {
      const searchParams = new SearchParams({
        perPage: (MIN_PER_PAGE - 2).toString(),
      });

      expect(searchParams.getPerPage()).toBe(MIN_PER_PAGE);
    });

    it("returns the closest per page option when the perPage parameter is between min and max but not a valid value", () => {
      const searchParams = new SearchParams({
        perPage: (perPageOptions[1] + 2).toString(),
      });

      expect(searchParams.getPerPage()).toBe(perPageOptions[1]);
    });

    it("returns the min per page when the perPage parameter is missing", () => {
      const searchParams = new SearchParams({});

      expect(searchParams.getPerPage()).toBe(MIN_PER_PAGE);
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
      const filters: AST = [
        {
          nodeType: "node",
          fieldType: "number",
          field: "publicationDate",
          value: 2010,
          comparator: "equals",
        },
      ];
      const searchParams = new SearchParams({
        filters: btoa(JSON.stringify(filters)),
      });

      expect(searchParams.getFilters()).toEqual(filters);
    });

    it("returns an empty array if the filters parameter is not a valid base64 string", () => {
      const searchParams = new SearchParams({ filter: "not base64" });

      expect(searchParams.getFilters()).toEqual([]);
    });

    it("returns an empty array if the filters parameter is a valid base64 but doesn't decode to valid JSON", () => {
      const searchParams = new SearchParams({
        filter: btoa("not json"),
      });

      expect(searchParams.getFilters()).toEqual([]);
    });

    it("returns an empty array if the filters parameter is missing", () => {
      const searchParams = new SearchParams({});

      expect(searchParams.getFilters()).toEqual([]);
    });
  });

  describe("setFilters", () => {
    it("sets the filters", () => {
      const filters: AST = [
        {
          nodeType: "node",
          fieldType: "number",
          field: "publicationDate",
          value: 2010,
          comparator: "equals",
        },
      ];
      const searchParams = new SearchParams({});

      searchParams.setFilters(filters);
      expect(searchParams.getFilters()).toEqual(filters);
    });
  });

  describe("deleteFilters", () => {
    it("deletes the filters", () => {
      const filters: AST = [
        {
          nodeType: "node",
          fieldType: "number",
          field: "publicationDate",
          value: 2010,
          comparator: "equals",
        },
      ];
      const searchParams = new SearchParams({
        filters: btoa(JSON.stringify(filters)),
      });

      searchParams.deleteFilters();
      expect(searchParams.getFilters()).toEqual([]);
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

    it("returns the default search mode when the searchMode parameter is missing", () => {
      const searchParams = new SearchParams({});

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
        ast: JSON.stringify(ast),
      });

      expect(searchParams.getAst()).toEqual(ast);
    });

    it("returns an empty AST if the ast parameter is invalid", () => {
      const searchParams = new SearchParams({ ast: "invalid" });

      expect(searchParams.getAst()).toEqual(getEmptyAst());
    });

    it("returns an empty AST if the ast parameter is missing", () => {
      const searchParams = new SearchParams({});

      expect(searchParams.getAst()).toEqual(getEmptyAst());
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
        ast: JSON.stringify(ast),
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

      expect(searchParams.getSortBy()).toBe(DEFAULT_SORT_BY);
    });

    it("returns the default sort by when the sortBy parameter is missing", () => {
      const searchParams = new SearchParams({});

      expect(searchParams.getSortBy()).toBe(DEFAULT_SORT_BY);
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

      expect(searchParams.getSortDirection()).toBe(DEFAULT_SORT_DIR);
    });

    it("returns the default sort direction when the sortDirection parameter is missing", () => {
      const searchParams = new SearchParams({});

      expect(searchParams.getSortDirection()).toBe(DEFAULT_SORT_DIR);
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

    it("returns undefined when the random seed paramater is missing", () => {
      const searchParams = new SearchParams({});

      expect(searchParams.getRandomSeed()).toBe(undefined);
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

    it("returns the default archive type when the archiveType parameter is missing", () => {
      const searchParams = new SearchParams({});

      expect(searchParams.getArchiveType()).toBe(DEFAULT_ARCHIVE_TYPE);
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

    it("returns the default compression level when the compressionLevel parameter is not a number", () => {
      const searchParams = new SearchParams({
        compressionLevel: "hello",
      });

      expect(searchParams.getCompressionLevel()).toBe(
        DEFAULT_COMPRESSION_LEVEL,
      );
    });

    it("returns the default compression level when the compressionLevel parameter is a number but not a valid compression level", () => {
      const searchParams = new SearchParams({
        compressionLevel: "5",
      });

      expect(searchParams.getCompressionLevel()).toBe(
        DEFAULT_COMPRESSION_LEVEL,
      );
    });

    it("returns the default compression level when the compressionLevel parameter is missing", () => {
      const searchParams = new SearchParams({});

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

  describe("toString", () => {
    it("converts the search params into a URL encoded URL component", () => {
      const searchParams = new SearchParams({
        q: "hello/world",
        size: "8",
      });

      expect(searchParams.toString()).toBe("q=hello%2Fworld&size=8");
    });
  });

  describe("toNative", () => {
    it("returns the underlying URLSearchParams instance", () => {
      const searchParams = new SearchParams({
        q: "hello",
        size: "8",
      });
      const native = searchParams.toNative();

      expect(native).toBeInstanceOf(URLSearchParams);
      expect(native.get("q")).toBe("hello");
      expect(native.get("size")).toBe("8");
      expect(native.get("unknown")).toBe(null);
    });
  });

  describe("clear", () => {
    it("clears the search parameters", async () => {
      const searchParams = new SearchParams({
        q: "hello",
        extract: "metadata[json]",
        size: "2",
        usage: "lodex",
      });

      searchParams.clear();
      expect(await searchParams.getQueryString()).toBe("");
      expect(searchParams.getSize()).toBe(0);
      expect(searchParams.getUsageName()).toBe(DEFAULT_USAGE_NAME);
      expect(searchParams.getFormats()).toBe(NO_FORMAT_SELECTED);
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
