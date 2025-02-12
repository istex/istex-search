import {
  mockSearchParams,
  customRender as render,
  screen,
} from "../test-utils";
import RawRequest from "@/app/[locale]/results/components/RawRequest";
import {
  buildResultPreviewUrl,
  type BuildResultPreviewUrlOptions,
} from "@/lib/istexApi";

describe("RawRequest", () => {
  it("displays the correct URL", () => {
    const options: BuildResultPreviewUrlOptions = {
      queryString: "hello",
      perPage: 20,
      page: 3,
    };
    mockSearchParams({
      perPage: options.perPage?.toString(),
      page: options.page?.toString(),
    });
    render(<RawRequest />, { queryString: options.queryString });

    const url = screen.getByRole("link");
    expect(url).toHaveAttribute(
      "href",
      buildResultPreviewUrl(options).toString(),
    );
    expect(url).toHaveTextContent(
      decodeURIComponent(buildResultPreviewUrl(options).toString()),
    );
  });

  it("applies a different background color to consecutive search params", () => {
    const { container } = render(<RawRequest />);

    const searchParams = container.querySelectorAll("a > span");
    for (let i = 0; i < searchParams.length; i++) {
      if (i === 0) {
        continue;
      }

      // Make sure the current search param as a different color than the previous one
      expect(getComputedStyle(searchParams[i]).color).not.toBe(
        getComputedStyle(searchParams[i - 1]).color,
      );
    }
  });
});
