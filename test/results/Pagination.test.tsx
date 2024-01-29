import {
  mockSearchParams,
  customRender as render,
  screen,
  userEvent,
} from "../test-utils";
import Pagination from "@/app/[locale]/results/components/Pagination";
import { MIN_PER_PAGE, istexApiConfig } from "@/config";
import { DEFAULT_LOCALE, useRouter } from "@/i18n/navigation";

describe("Pagination", () => {
  // We only test the next page button because the same logic is applied to all buttons
  it("goes to the next page when clicking the next page button", async () => {
    const router = useRouter();
    render(<Pagination />, { resultsCount: 20 });

    const button = screen.getByTestId("KeyboardArrowRightIcon");
    await userEvent.click(button);

    expect(router.push).toBeCalledWith("/?page=2");
  });

  it("initializes the page number base on the page in the URL", () => {
    const page = "3";
    mockSearchParams({
      page,
    });
    render(<Pagination />, { resultsCount: 100 });

    const pageLabel = screen.getByTestId("pagination-page");

    expect(pageLabel).toHaveTextContent(page);
  });

  it("limits the last page when the results count is greater than the max pagination offset", async () => {
    const router = useRouter();
    const resultsCount = istexApiConfig.maxPaginationOffset + 1000;
    render(<Pagination />, { resultsCount });

    // The last page is based on the maxPaginationOffset because resultsCount is too large
    const lastPage = Math.ceil(
      istexApiConfig.maxPaginationOffset / MIN_PER_PAGE,
    );
    const lastPageButton = screen.getByTestId("KeyboardDoubleArrowRightIcon");
    await userEvent.click(lastPageButton);

    expect(router.push).toBeCalledWith(`/?page=${lastPage}`);
  });

  it("limits the page number based on the results count", () => {
    const resultsCount = 1000;
    const lastPage = Math.ceil(resultsCount / MIN_PER_PAGE);

    mockSearchParams({
      page: (lastPage + 2).toString(),
    });
    render(<Pagination />, { resultsCount });

    const pageLabel = screen.getByTestId("pagination-page");

    expect(pageLabel).toHaveTextContent(
      lastPage.toLocaleString(DEFAULT_LOCALE),
      { normalizeWhitespace: false },
    );
  });
});
