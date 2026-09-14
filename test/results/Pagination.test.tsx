import Pagination from "@/app/[locale]/results/components/Pagination";
import { istexApiConfig, MIN_PER_PAGE } from "@/config";
import routing from "@/i18n/routing";
import type { IstexApiResponse } from "@/lib/istexApi";
import { customRender as render, screen, userEvent } from "../test-utils";

describe("Pagination", () => {
  // We only test the next page button because the same logic is applied to all buttons
  it("goes to the next page when clicking the next page button", async () => {
    const onUrlUpdate = jest.fn();
    render(<Pagination />, { results: generateResults(20) }, { onUrlUpdate });

    const button = screen.getByTestId("KeyboardArrowRightIcon");
    await userEvent.click(button);

    expect(onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: "?page=2",
        options: expect.objectContaining({ shallow: false, history: "push" }),
      }),
    );
  });

  it("uses the randomSeed when present", async () => {
    const onUrlUpdate = jest.fn();
    const randomSeed = "1234";
    render(
      <Pagination />,
      { results: generateResults(20), randomSeed },
      { onUrlUpdate },
    );

    const button = screen.getByTestId("KeyboardArrowRightIcon");
    await userEvent.click(button);

    expect(onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: `?randomSeed=${randomSeed}&page=2`,
        options: expect.objectContaining({ shallow: false, history: "push" }),
      }),
    );
  });

  it("initializes the page number base on the page in the URL", () => {
    const page = "3";
    render(
      <Pagination />,
      { results: generateResults(100) },
      { searchParams: { page } },
    );

    const pageLabel = screen.getByTestId("pagination-page");

    expect(pageLabel).toHaveTextContent(page);
  });

  it("limits the last page when the results count is greater than the max pagination offset", async () => {
    const onUrlUpdate = jest.fn();
    const resultCount = istexApiConfig.maxPaginationOffset + 1000;
    render(
      <Pagination />,
      { results: generateResults(resultCount) },
      { onUrlUpdate },
    );

    // The last page is based on the maxPaginationOffset because resultCount is too large
    const lastPage = Math.ceil(
      istexApiConfig.maxPaginationOffset / MIN_PER_PAGE,
    );
    const lastPageButton = screen.getByTestId("KeyboardDoubleArrowRightIcon");
    await userEvent.click(lastPageButton);

    expect(onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: `?page=${lastPage.toString()}`,
        options: expect.objectContaining({ shallow: false, history: "push" }),
      }),
    );
  });

  it("limits the page number based on the results count", () => {
    const resultCount = 1000;
    const lastPage = Math.ceil(resultCount / MIN_PER_PAGE);
    render(
      <Pagination />,
      { results: generateResults(resultCount) },
      { searchParams: { page: (lastPage + 2).toString() } },
    );

    const pageLabel = screen.getByTestId("pagination-page");

    expect(pageLabel).toHaveTextContent(
      lastPage.toLocaleString(routing.defaultLocale),
      { normalizeWhitespace: false },
    );
  });
});

function generateResults(resultCount: number): IstexApiResponse {
  return {
    total: resultCount,
    hits: [],
    aggregations: {},
  };
}
