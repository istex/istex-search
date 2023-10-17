import useSearchParams from "./useSearchParams";
import {
  DEFAULT_USAGE_NAME,
  NO_FORMAT_SELECTED,
  formats,
  istexApiConfig,
} from "@/config";

describe("SearchParams class", () => {
  it("getQueryString", () => {
    const searchParams = useSearchParams({ q: "hello" });

    expect(searchParams.getQueryString()).toBe("hello");
  });

  it("setQueryString", () => {
    const searchParams = useSearchParams({ q: "hello" });

    searchParams.setQueryString("world");
    expect(searchParams.getQueryString()).toBe("world");
  });

  it("deleteQueryString", () => {
    const searchParams = useSearchParams({ q: "hello" });

    searchParams.deleteQueryString();
    expect(searchParams.getQueryString()).toBe("");
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

    const tooBigSize = useSearchParams({
      size: (istexApiConfig.maxSize + 2).toString(),
    });
    expect(tooBigSize.getSize()).toBe(istexApiConfig.maxSize);

    const tooSmallSize = useSearchParams({ size: "-1" });
    expect(tooSmallSize.getSize()).toBe(0);
  });

  it("setSize", () => {
    const searchParams = useSearchParams({ size: "2" });

    searchParams.setSize(3);
    expect(searchParams.getSize()).toBe(3);

    searchParams.setSize(istexApiConfig.maxSize + 2);
    expect(searchParams.getSize()).toBe(istexApiConfig.maxSize);

    searchParams.setSize(-1);
    expect(searchParams.getSize()).toBe(0);
  });

  it("deleteSize", () => {
    const searchParams = useSearchParams({ size: "2" });

    searchParams.deleteSize();
    expect(searchParams.getSize()).toBe(0);
  });

  it("clear", () => {
    const searchParams = useSearchParams({
      q: "hello",
      extract: "metadata[json]",
      size: "2",
      usage: "lodex",
    });

    searchParams.clear();

    expect(searchParams.getQueryString()).toBe("");
    expect(searchParams.getSize()).toBe(0);
    expect(searchParams.getUsageName()).toBe(DEFAULT_USAGE_NAME);
    expect(searchParams.getFormats()).toBe(NO_FORMAT_SELECTED);
  });
});
