import { useRouter } from "next-intl/client";
import {
  mockSearchParams,
  customRender as render,
  screen,
  userEvent,
} from "../test-utils";
import Pagination from "@/app/[locale]/results/components/Pagination";
import { MIN_PER_PAGE, istexApiConfig, perPageOptions } from "@/config";
import ResultsProvider from "@/contexts/ResultsContext";
import { DEFAULT_LOCALE } from "@/i18n/constants";

describe("Pagination", () => {
  it("changes the number of results per page when using the dropdown", async () => {
    const router = useRouter();
    render(
      <ResultsProvider resultsCount={3}>
        <Pagination />
      </ResultsProvider>,
    );

    const dropdown = screen.getByRole("button", {
      name: `par page ${MIN_PER_PAGE}`,
    });
    await userEvent.click(dropdown);
    const secondOptionLabel = perPageOptions[1].toString();
    const secondOption = screen.getByRole("option", {
      name: secondOptionLabel,
    });
    await userEvent.click(secondOption);

    expect(router.replace).toBeCalledWith(`/?perPage=${secondOptionLabel}`);
  });

  // We only test the next page button because the same logic is applied to all buttons
  it("goes to the next page when clicking the next page button", async () => {
    const router = useRouter();
    render(
      <ResultsProvider resultsCount={20}>
        <Pagination />
      </ResultsProvider>,
    );

    const button = screen.getByRole("button", {
      name: "Aller à la page suivante",
    });
    await userEvent.click(button);

    expect(router.push).toBeCalledWith("/?page=2");
  });

  it("initializes the dropdown value based on the perPage in the URL", () => {
    const perPage = perPageOptions[1].toString();
    mockSearchParams({
      perPage,
    });
    const { container } = render(
      <ResultsProvider resultsCount={3}>
        <Pagination />
      </ResultsProvider>,
    );

    const dropdown = container.getElementsByTagName("input")[0];

    expect(dropdown.value).toBe(perPage);
  });

  it("initializes the page number base on the page in the URL", () => {
    const page = "3";
    mockSearchParams({
      page,
    });
    const { container } = render(
      <ResultsProvider resultsCount={100}>
        <Pagination />
      </ResultsProvider>,
    );

    const pageLabel = container.getElementsByClassName(
      "MuiTablePagination-displayedRows",
    )[0];

    expect(pageLabel).toHaveTextContent(page);
  });

  it("limits the last page when the results count is greater than the max pagination offset", async () => {
    const router = useRouter();
    const resultsCount = istexApiConfig.maxPaginationOffset + 1000;
    render(
      <ResultsProvider resultsCount={resultsCount}>
        <Pagination />
      </ResultsProvider>,
    );

    // The last page is based on the maxPaginationOffset because resultsCount is too large
    const lastPage = Math.ceil(
      istexApiConfig.maxPaginationOffset / MIN_PER_PAGE,
    );
    const lastPageButton = screen.getByRole("button", {
      name: "Aller à la dernière page",
    });
    await userEvent.click(lastPageButton);

    expect(router.push).toBeCalledWith(`/?page=${lastPage}`);
  });

  it("limits the page number based on the results count", () => {
    const resultsCount = 1000;
    const lastPage = Math.ceil(resultsCount / MIN_PER_PAGE);

    mockSearchParams({
      page: (lastPage + 2).toString(),
    });
    const { container } = render(
      <ResultsProvider resultsCount={resultsCount}>
        <Pagination />
      </ResultsProvider>,
    );

    const pageLabel = container.getElementsByClassName(
      "MuiTablePagination-displayedRows",
    )[0];

    expect(pageLabel).toHaveTextContent(
      lastPage.toLocaleString(DEFAULT_LOCALE),
      { normalizeWhitespace: false },
    );
  });
});
