import ResultsSettings from "@/app/[locale]/results/components/Download/ResultsSettings";
import { istexApiConfig, SEARCH_MODE_IMPORT } from "@/config";
import routing from "@/i18n/routing";
import type { IstexApiResponse } from "@/lib/istexApi";
import { customRender as render, screen, userEvent } from "../test-utils";

describe("ResultsSettings", () => {
  it("changes the size in the URL when changing the input value", async () => {
    const resultCount = 3;
    const newValue = 2;
    await testModification(resultCount, newValue, newValue);
  });

  it("sets the size to the max size when the results count is greater than the max size", async () => {
    const resultCount = istexApiConfig.maxSize + 10;
    await testAllButton(resultCount, istexApiConfig.maxSize);
  });

  it("sets the size to the results count when the results count is smaller than the max size", async () => {
    const resultCount = 10;
    await testAllButton(resultCount, resultCount);
  });

  it("initializes the input value based on the results count", () => {
    const resultCount = 3;
    testInitialization(resultCount, resultCount);
  });

  it("initializes the input value to the max size when the results count is greater than the max size", () => {
    const resultCount = istexApiConfig.maxSize + 10;
    testInitialization(resultCount, istexApiConfig.maxSize);
  });

  it("disables the sorting when in import mode", () => {
    render(
      <ResultsSettings />,
      {},
      { searchParams: { searchMode: SEARCH_MODE_IMPORT } },
    );

    const sorting = screen.getByRole("combobox");
    expect(sorting).toHaveAttribute("aria-disabled", "true");
  });
});

// Common logic between tests that interact with the size input
async function testModification(
  resultCount: number,
  wishValue: number,
  expectedValue: number,
) {
  const onUrlUpdate = jest.fn();
  const results: IstexApiResponse = {
    total: resultCount,
    hits: [],
    aggregations: {},
  };
  render(<ResultsSettings />, { results }, { onUrlUpdate });

  const input = screen.getByRole("textbox");
  await userEvent.clear(input);
  await userEvent.paste(wishValue.toString());

  expect(onUrlUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      queryString: `?size=${expectedValue}`,
    }),
  );
}

async function testAllButton(resultCount: number, expectedValue: number) {
  const onUrlUpdate = jest.fn();
  const results: IstexApiResponse = {
    total: resultCount,
    hits: [],
    aggregations: {},
  };
  render(
    <ResultsSettings />,
    { results },
    { searchParams: { size: "1" }, onUrlUpdate },
  );

  const button = screen.getByRole("button", { name: "Tout" });
  await userEvent.click(button);

  expect(onUrlUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      queryString: `?size=${expectedValue}`,
    }),
  );
}

// Common logic between tests that make sure the size input value is properly
// set based on the results count
function testInitialization(resultCount: number, expectedValue: number) {
  const results: IstexApiResponse = {
    total: resultCount,
    hits: [],
    aggregations: {},
  };
  render(
    <ResultsSettings />,
    { results },
    { searchParams: { size: resultCount.toString() } },
  );

  const input = screen.getByRole("textbox");

  expect(input).toHaveValue(
    expectedValue.toLocaleString(routing.defaultLocale),
  );
}
