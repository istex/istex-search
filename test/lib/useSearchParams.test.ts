import {
  DEFAULT_SORT_BY,
  DEFAULT_SORT_DIR,
  DEFAULT_USAGE_NAME,
  MAX_PER_PAGE,
  MIN_PER_PAGE,
  NO_FORMAT_SELECTED,
  SEARCH_MODE_IMPORT,
  SEARCH_MODE_ASSISTED,
  SEARCH_MODE_REGULAR,
  formats,
  istexApiConfig,
  perPageOptions,
} from "@/config";
import { getEmptyAst, type AST } from "@/lib/assistedSearch/ast";
import useSearchParams from "@/lib/useSearchParams";

describe("SearchParams class", () => {
  it("getQueryString", async () => {
    const searchParams = useSearchParams({ q: "hello" });

    expect(await searchParams.getQueryString()).toBe("hello");
  });

  it("setQueryString", async () => {
    const searchParams = useSearchParams({ q: "hello" });

    await searchParams.setQueryString("world");
    expect(await searchParams.getQueryString()).toBe("world");
  });

  it("deleteQueryString", async () => {
    const searchParams = useSearchParams({ q: "hello" });

    searchParams.deleteQueryString();
    expect(await searchParams.getQueryString()).toBe("");
  });

  it("getFormats", () => {
    const validSearchParams = useSearchParams({ extract: "fulltext[pdf]" });
    expect(validSearchParams.getFormats()).toBe(formats.fulltext.pdf);

    const invalidSearchParams = useSearchParams({ extract: "hello" });
    expect(invalidSearchParams.getFormats()).toBe(NO_FORMAT_SELECTED);
  });

  it("setFormats", () => {
    const searchParams = useSearchParams({ extract: "fulltext[pdf]" });

    searchParams.setFormats(formats.metadata.json);
    expect(searchParams.getFormats()).toBe(formats.metadata.json);
  });

  it("deleteFormats", () => {
    const searchParams = useSearchParams({ extract: "fulltext[pdf]" });

    searchParams.deleteFormats();
    expect(searchParams.getFormats()).toBe(NO_FORMAT_SELECTED);
  });

  it("getUsageName", () => {
    const validSearchParams = useSearchParams({ usage: "lodex" });
    expect(validSearchParams.getUsageName()).toBe("lodex");

    const invalidSearchParams = useSearchParams({ usage: "hello" });
    expect(invalidSearchParams.getUsageName()).toBe(DEFAULT_USAGE_NAME);
  });

  it("setUsageName", () => {
    const searchParams = useSearchParams({ usage: "lodex" });

    searchParams.setUsageName("custom");
    expect(searchParams.getUsageName()).toBe("custom");
  });

  it("deleteUsageName", () => {
    const searchParams = useSearchParams({ usage: "lodex" });

    searchParams.deleteUsageName();
    expect(searchParams.getUsageName()).toBe(DEFAULT_USAGE_NAME);
  });

  it("getSize", () => {
    const validSearchParams = useSearchParams({ size: "2" });
    expect(validSearchParams.getSize()).toBe(2);

    const invalidSearchParams = useSearchParams({ size: "hello" });
    expect(invalidSearchParams.getSize()).toBe(0);

    const tooBig = useSearchParams({
      size: (istexApiConfig.maxSize + 2).toString(),
    });
    expect(tooBig.getSize()).toBe(istexApiConfig.maxSize);

    const tooSmall = useSearchParams({ size: "-1" });
    expect(tooSmall.getSize()).toBe(0);

    const decimalRoundDown = useSearchParams({ size: "1.2" });
    expect(decimalRoundDown.getSize()).toBe(1);

    const decimalRowndUp = useSearchParams({ size: "1.7" });
    expect(decimalRowndUp.getSize()).toBe(2);
  });

  it("setSize", () => {
    const searchParams = useSearchParams({ size: "2" });

    searchParams.setSize(3);
    expect(searchParams.getSize()).toBe(3);

    searchParams.setSize(istexApiConfig.maxSize + 2);
    expect(searchParams.getSize()).toBe(istexApiConfig.maxSize);

    searchParams.setSize(-1);
    expect(searchParams.getSize()).toBe(0);

    searchParams.setSize(1.2);
    expect(searchParams.getSize()).toBe(1);

    searchParams.setSize(1.7);
    expect(searchParams.getSize()).toBe(2);
  });

  it("deleteSize", () => {
    const searchParams = useSearchParams({ size: "2" });

    searchParams.deleteSize();
    expect(searchParams.getSize()).toBe(0);
  });

  it("getPage", () => {
    const perPage = MIN_PER_PAGE;
    const minPage = 1;
    const maxPage = Math.ceil(istexApiConfig.maxPaginationOffset / perPage);
    const validSearchParams = useSearchParams({
      page: "2",
      perPage: perPage.toString(),
    });
    expect(validSearchParams.getPage()).toBe(2);

    const invalidSearchParams = useSearchParams({ size: "hello" });
    expect(invalidSearchParams.getPage()).toBe(minPage);

    const tooBig = useSearchParams({
      page: (maxPage + 2).toString(),
    });
    expect(tooBig.getPage()).toBe(maxPage);

    const tooSmall = useSearchParams({ page: "-1" });
    expect(tooSmall.getPage()).toBe(minPage);

    const decimalRoundDown = useSearchParams({ page: "1.2" });
    expect(decimalRoundDown.getPage()).toBe(1);

    const decimalRowndUp = useSearchParams({ page: "1.7" });
    expect(decimalRowndUp.getPage()).toBe(2);
  });

  it("setPage", () => {
    const perPage = MIN_PER_PAGE;
    const minPage = 1;
    const maxPage = Math.ceil(istexApiConfig.maxPaginationOffset / perPage);
    const searchParams = useSearchParams({
      page: "2",
      perPage: perPage.toString(),
    });

    searchParams.setPage(3);
    expect(searchParams.getPage()).toBe(3);

    searchParams.setPage(maxPage + 2);
    expect(searchParams.getPage()).toBe(maxPage);

    searchParams.setPage(-1);
    expect(searchParams.getPage()).toBe(minPage);

    searchParams.setPage(1.2);
    expect(searchParams.getPage()).toBe(1);

    searchParams.setPage(1.7);
    expect(searchParams.getPage()).toBe(2);
  });

  it("deletePage", () => {
    const minPage = 1;
    const searchParams = useSearchParams({ page: "2" });

    searchParams.deletePage();
    expect(searchParams.getPage()).toBe(minPage);
  });

  it("getPerPage", () => {
    const validSearchParams = useSearchParams({
      perPage: perPageOptions[1].toString(),
    });
    expect(validSearchParams.getPerPage()).toBe(perPageOptions[1]);

    const invalidSearchParams = useSearchParams({ perPage: "hello" });
    expect(invalidSearchParams.getPerPage()).toBe(MIN_PER_PAGE);

    const tooBig = useSearchParams({
      perPage: (MAX_PER_PAGE + 2).toString(),
    });
    expect(tooBig.getPerPage()).toBe(MAX_PER_PAGE);

    const tooSmall = useSearchParams({
      perPage: (MIN_PER_PAGE - 2).toString(),
    });
    expect(tooSmall.getPerPage()).toBe(MIN_PER_PAGE);

    const inBetween = useSearchParams({
      perPage: (perPageOptions[1] + 2).toString(),
    });
    expect(inBetween.getPerPage()).toBe(perPageOptions[1]);
  });

  it("setPerPage", () => {
    const searchParams = useSearchParams({ perPage: MIN_PER_PAGE.toString() });

    searchParams.setPerPage(perPageOptions[1]);
    expect(searchParams.getPerPage()).toBe(perPageOptions[1]);
  });

  it("deletePerPage", () => {
    const searchParams = useSearchParams({ perPage: MAX_PER_PAGE.toString() });

    searchParams.deletePerPage();
    expect(searchParams.getPerPage()).toBe(MIN_PER_PAGE);
  });

  it("clear", async () => {
    const searchParams = useSearchParams({
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

  it("should get filters", () => {
    const searchParams = useSearchParams({
      q: "hello",
      filter: '{"language":["fre","eng"]}',
    });

    expect(searchParams.getFilters()).toEqual({
      language: ["fre", "eng"],
    });
  });

  it("should set filters", () => {
    const searchParams = useSearchParams({
      q: "hello",
    });

    searchParams.setFilters({
      language: ["fre", "eng"],
    });

    expect(searchParams.getFilters()).toEqual({
      language: ["fre", "eng"],
    });
  });

  it("should delete filters", () => {
    const searchParams = useSearchParams({
      q: "hello",
      filter: '{"language":["fre","eng"]}',
    });

    searchParams.deleteFilters();

    expect(searchParams.getFilters()).toEqual({});
  });

  it("should get last applied facet", () => {
    const searchParams = useSearchParams({
      q: "hello",
      lastAppliedFacet: "corpusName",
    });

    expect(searchParams.getLastAppliedFacet()).toBe("corpusName");
  });

  it("should set last applied facet", () => {
    const searchParams = useSearchParams({
      q: "hello",
    });

    searchParams.setLastAppliedFacet("corpusName");

    expect(searchParams.getLastAppliedFacet()).toBe("corpusName");
  });

  it("should delete last applied facet", () => {
    const searchParams = useSearchParams({
      q: "hello",
      lastAppliedFacet: "corpusName",
    });

    searchParams.deleteLastAppliedFacet();

    expect(searchParams.getLastAppliedFacet()).toBe("");
  });

  it("should get search mode", () => {
    const searchParams = useSearchParams({
      q: "hello",
      searchMode: SEARCH_MODE_IMPORT,
    });

    expect(searchParams.getSearchMode()).toBe(SEARCH_MODE_IMPORT);
  });

  it("should set search mode", () => {
    const searchParams = useSearchParams({
      q: "hello",
    });

    searchParams.setSearchMode(SEARCH_MODE_ASSISTED);

    expect(searchParams.getSearchMode()).toBe(SEARCH_MODE_ASSISTED);
  });

  it("should delete search mode", () => {
    const searchParams = useSearchParams({
      q: "hello",
      searchMode: SEARCH_MODE_ASSISTED,
    });

    searchParams.deleteSearchMode();

    expect(searchParams.getSearchMode()).toBe(SEARCH_MODE_REGULAR);
  });

  it("should get ast", () => {
    const ast: AST = [
      {
        nodeType: "node",
        fieldType: "text",
        field: "abstract",
        value: "foo",
        comparator: "equals",
      },
    ];
    const searchParams = useSearchParams({
      q: "hello",
      ast: btoa(JSON.stringify(ast)),
    });

    expect(searchParams.getAst()).toEqual(ast);
  });

  it("should set ast", () => {
    const ast: AST = [
      {
        nodeType: "node",
        fieldType: "text",
        field: "abstract",
        value: "foo",
        comparator: "equals",
      },
    ];
    const searchParams = useSearchParams({
      q: "hello",
    });

    searchParams.setAst(ast);

    expect(searchParams.getAst()).toEqual(ast);
  });

  it("should delete ast", () => {
    const ast: AST = [
      {
        nodeType: "node",
        fieldType: "text",
        field: "abstract",
        value: "foo",
        comparator: "equals",
      },
    ];
    const searchParams = useSearchParams({
      q: "hello",
      ast: btoa(JSON.stringify(ast)),
    });

    searchParams.deleteAst();

    expect(searchParams.getAst()).toEqual(getEmptyAst());
  });

  it("should get sort by", () => {
    const searchParams = useSearchParams({
      q: "hello",
      sortBy: "publicationDate",
    });

    expect(searchParams.getSortBy()).toBe("publicationDate");
  });

  it("should set sort by", () => {
    const searchParams = useSearchParams({
      q: "hello",
    });

    searchParams.setSortBy("publicationDate");

    expect(searchParams.getSortBy()).toBe("publicationDate");
  });

  it("should delete sort by", () => {
    const searchParams = useSearchParams({
      q: "hello",
      sortBy: "publicationDate",
    });

    searchParams.deleteSortBy();

    expect(searchParams.getSortBy()).toBe(DEFAULT_SORT_BY);
  });

  it("should get sort direction", () => {
    const searchParams = useSearchParams({
      q: "hello",
      sortDirection: "asc",
    });

    expect(searchParams.getSortDirection()).toBe("asc");
  });

  it("should set sort direction", () => {
    const searchParams = useSearchParams({
      q: "hello",
    });

    searchParams.setSortDirection("asc");

    expect(searchParams.getSortDirection()).toBe("asc");
  });

  it("should delete sort direction", () => {
    const searchParams = useSearchParams({
      q: "hello",
      sortDirection: "desc",
    });

    searchParams.deleteSortDirection();

    expect(searchParams.getSortDirection()).toBe(DEFAULT_SORT_DIR);
  });

  // Make Math.random always return the same value to avoid mismatches in node IDs when testing
  beforeAll(() => {
    jest.spyOn(Math, "random").mockReturnValue(0);
  });
  afterAll(() => {
    jest.spyOn(Math, "random").mockRestore();
  });
});
