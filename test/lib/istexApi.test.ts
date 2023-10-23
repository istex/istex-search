import { MIN_PER_PAGE, NO_FORMAT_SELECTED, formats } from "@/config";
import * as Module from "@/lib/istexApi";

describe("Istex API related functions", () => {
  it("buildResultPreviewUrl", () => {
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
      "https://api.istex.fr/document?q=hello&size=10&from=0&output=*&sid=istex-dl",
    );

    expect(Module.buildResultPreviewUrl(completeParams).toString()).toBe(
      "https://api.istex.fr/document?q=hello&size=10&from=20&output=abstract%2Ctitle&sid=istex-dl",
    );
  });

  it("buildFullApiUrl", () => {
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
});
