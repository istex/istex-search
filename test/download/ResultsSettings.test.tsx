import {
  mockSearchParams,
  customRender as render,
  screen,
  userEvent,
} from "../test-utils";
import ResultsSettings from "@/app/[locale]/results/Download/ResultsSettings";
import { istexApiConfig } from "@/config";
import { useRouter } from "@/i18n/navigation";

describe("ResultsSettings", () => {
  it("changes the size in the URL when changing the input value", async () => {
    const resultsCount = 3;
    const newValue = 2;
    await testModification(resultsCount, newValue, newValue);
  });

  it("sets the size to the results count when the new value is greater than the results count", async () => {
    const resultsCount = 3;
    const newValue = 4;
    await testModification(resultsCount, newValue, resultsCount);
  });

  it("sets the size to the max size when the new value is greater than the max size", async () => {
    const resultsCount = istexApiConfig.maxSize + 10;
    const newValue = istexApiConfig.maxSize + 3;
    await testModification(resultsCount, newValue, istexApiConfig.maxSize);
  });

  it("initializes the input value based on the results count", () => {
    const resultsCount = 3;
    testInitialization(resultsCount, resultsCount);
  });

  it("initializes the input value to the max size when the results count is greater than the max size", () => {
    const resultsCount = istexApiConfig.maxSize + 10;
    testInitialization(resultsCount, istexApiConfig.maxSize);
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
  resultsCount: number,
  wishValue: number,
  expectedValue: number,
) {
  render(<ResultsSettings />, { resultsCount });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  const input = screen.getByRole("spinbutton");
  await userEvent.clear(input);
  await userEvent.paste(wishValue.toString());

  expect(router.replace).toHaveBeenCalledWith(`/?size=${expectedValue}`, {
    scroll: false,
  });
}

// Common logic between tests that make sure the size input value is properly
// set based on the results count
function testInitialization(resultsCount: number, expectedValue: number) {
  mockSearchParams({
    size: resultsCount.toString(),
  });
  render(<ResultsSettings />, { resultsCount });

  const input = screen.getByRole("spinbutton");

  expect(input).toHaveValue(expectedValue);
}
