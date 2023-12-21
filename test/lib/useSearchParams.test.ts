import {
  DEFAULT_USAGE_NAME,
  MAX_PER_PAGE,
  MIN_PER_PAGE,
  NO_FORMAT_SELECTED,
  formats,
  istexApiConfig,
  perPageOptions,
} from "@/config";
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
});
