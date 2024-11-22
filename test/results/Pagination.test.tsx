import {
  mockSearchParams,
  customRender as render,
  screen,
  userEvent,
} from "../test-utils";
import Pagination from "@/app/[locale]/results/components/Pagination";
import { MIN_PER_PAGE, istexApiConfig } from "@/config";
import { routing, useRouter } from "@/i18n/routing";
import type { IstexApiResponse } from "@/lib/istexApi";

describe("Pagination", () => {
  // We only test the next page button because the same logic is applied to all buttons
  it("goes to the next page when clicking the next page button", async () => {
    const router = useRouter();
    render(<Pagination />, { results: generateResults(20) });

    const button = screen.getByTestId("KeyboardArrowRightIcon");
    await userEvent.click(button);

    expect(router.push).toHaveBeenCalledWith("/?page=2");
  });

  it("uses the randomSeed when present", async () => {
    const randomSeed = "1234";
    const router = useRouter();
    render(<Pagination />, { results: generateResults(20), randomSeed });

    const button = screen.getByTestId("KeyboardArrowRightIcon");
    await userEvent.click(button);

    expect(router.push).toHaveBeenCalledWith(
      `/?page=2&randomSeed=${randomSeed}`,
    );
  });

  it("initializes the page number base on the page in the URL", () => {
    const page = "3";
    mockSearchParams({
      page,
    });
    render(<Pagination />, { results: generateResults(100) });

    const pageLabel = screen.getByTestId("pagination-page");

    expect(pageLabel).toHaveTextContent(page);
  });

  it("limits the last page when the results count is greater than the max pagination offset", async () => {
    const router = useRouter();
    const resultCount = istexApiConfig.maxPaginationOffset + 1000;
    render(<Pagination />, { results: generateResults(resultCount) });

    // The last page is based on the maxPaginationOffset because resultCount is too large
    const lastPage = Math.ceil(
      istexApiConfig.maxPaginationOffset / MIN_PER_PAGE,
    );
    const lastPageButton = screen.getByTestId("KeyboardDoubleArrowRightIcon");
    await userEvent.click(lastPageButton);

    expect(router.push).toHaveBeenCalledWith(`/?page=${lastPage.toString()}`);
  });

  it("limits the page number based on the results count", () => {
    const resultCount = 1000;
    const lastPage = Math.ceil(resultCount / MIN_PER_PAGE);

    mockSearchParams({
      page: (lastPage + 2).toString(),
    });
    render(<Pagination />, { results: generateResults(resultCount) });

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
