import { describe, expect, it } from "@jest/globals";
import useSearchParams from "./useSearchParams";
import { NO_FORMAT_SELECTED, formats, istexApiConfig } from "@/config";

describe("Tests for the SearchParams class", () => {
  it("getQueryString", () => {
    const searchParams = useSearchParams({ q: "hello" });

    expect(searchParams.getQueryString()).toBe("hello");
  });

  it("setQueryString", () => {
    const searchParams = useSearchParams({ q: "hello" });

    searchParams.setQueryString("world");
    expect(searchParams.getQueryString()).toBe("world");
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

  it("getUsageName", () => {
    const validSearchParams = useSearchParams({ usage: "lodex" });
    expect(validSearchParams.getUsageName()).toBe("lodex");

    const invalidSearchParams = useSearchParams({ usage: "hello" });
    expect(invalidSearchParams.getUsageName()).toBe("custom");
  });

  it("setUsageName", () => {
    const searchParams = useSearchParams({ usage: "lodex" });

    searchParams.setUsageName("custom");
    expect(searchParams.getUsageName()).toBe("custom");
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
});
