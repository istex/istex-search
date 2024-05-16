import {
  mockSearchParams,
  customRender as render,
  screen,
} from "../test-utils";
import InfoPanels from "@/app/[locale]/results/components/Download/InfoPanels";
import type { UsageName } from "@/config";
import { buildResultPreviewUrl } from "@/lib/istexApi";

describe("InfoPanels", () => {
  it("displays the correct usage panel based on the usage in the URL", () => {
    testUsagePanelPresence({ usage: "lodex" }, "Lodex");
  });

  it("sets the active usage to the custom usage by default", () => {
    testUsagePanelPresence({}, "Usage personnalisé");
  });

  it("displays the query string in the query string panel", () => {
    const queryString = "hello";
    testPanelContent(queryString, "query-string", queryString);
  });

  it("displays the raw request in the raw request panel", () => {
    const queryString = "hello";
    const resultPreviewUrl = buildResultPreviewUrl({ queryString }).toString();
    testPanelContent(
      queryString,
      "raw-request",
      decodeURIComponent(resultPreviewUrl),
    );
  });
});

function testUsagePanelPresence(
  searchParams: { usage?: UsageName },
  heading: string,
) {
  mockSearchParams(searchParams);
  render(<InfoPanels />);

  const usageHeading = screen.getByRole("heading", {
    name: heading,
  });

  expect(usageHeading).toBeInTheDocument();
}

function testPanelContent(
  queryString: string,
  testId: string,
  expectedContent: string,
) {
  render(<InfoPanels />, { queryString });

  const panel = screen.getByTestId(testId);

  expect(panel).toHaveTextContent(expectedContent);
}
