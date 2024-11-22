import {
  mockSearchParams,
  customRender as render,
  screen,
  userEvent,
} from "../test-utils";
import ResultsSettings from "@/app/[locale]/results/components/Download/ResultsSettings";
import { istexApiConfig } from "@/config";
import { routing, useRouter } from "@/i18n/routing";
import type { IstexApiResponse } from "@/lib/istexApi";

describe("ResultsSettings", () => {
  beforeEach(() => {
    jest.useFakeTimers({ advanceTimers: true });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

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
    mockSearchParams({
      searchMode: "import",
    });
    render(<ResultsSettings />);

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
  const results: IstexApiResponse = {
    total: resultCount,
    hits: [],
    aggregations: {},
  };
  render(<ResultsSettings />, { results });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  const input = screen.getByRole("textbox");
  await userEvent.clear(input);
  await userEvent.paste(wishValue.toString());
  jest.runAllTimers();

  expect(router.replace).toHaveBeenCalledWith(`/?size=${expectedValue}`, {
    scroll: false,
  });
}

async function testAllButton(resultCount: number, expectedValue: number) {
  const results: IstexApiResponse = {
    total: resultCount,
    hits: [],
    aggregations: {},
  };
  mockSearchParams({
    size: "1",
  });
  render(<ResultsSettings />, { results });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  const button = screen.getByRole("button", { name: "Tout" });
  await userEvent.click(button);
  jest.runAllTimers();

  expect(router.replace).toHaveBeenCalledWith(`/?size=${expectedValue}`, {
    scroll: false,
  });
}

// Common logic between tests that make sure the size input value is properly
// set based on the results count
function testInitialization(resultCount: number, expectedValue: number) {
  const results: IstexApiResponse = {
    total: resultCount,
    hits: [],
    aggregations: {},
  };
  mockSearchParams({
    size: resultCount.toString(),
  });
  render(<ResultsSettings />, { results });

  const input = screen.getByRole("textbox");

  expect(input).toHaveValue(
    expectedValue.toLocaleString(routing.defaultLocale),
  );
}
