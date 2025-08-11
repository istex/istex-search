import {
  mockSearchParams,
  customRender as render,
  screen,
} from "../test-utils";
import InfoPanels from "@/app/[locale]/results/components/Download/InfoPanels";
import { buildResultPreviewUrl } from "@/lib/istexApi";

describe("InfoPanels", () => {
  it("displays the correct usage panel based on the usage in the URL", () => {
    mockSearchParams({ usage: "lodex" });
    render(<InfoPanels />);

    const usageHeading = screen.getByRole("heading", {
      name: "Lodex",
    });

    expect(usageHeading).toBeInTheDocument();
  });

  it("sets the active usage to the custom usage by default", () => {
    mockSearchParams({});
    render(<InfoPanels />);

    const usageHeading = screen.getByRole("heading", {
      name: "Usage personnalisé",
    });

    expect(usageHeading).toBeInTheDocument();
  });

  it("displays the query string in the query string panel", () => {
    const queryString = "hello";
    render(<InfoPanels />, { queryString });

    const panel = screen.getByTestId("query-string");

    expect(panel).toHaveTextContent(queryString);
  });

  it("truncates the displayed query string when it's too long", () => {
    const queryString = Array(200).fill("hello").join("");
    render(<InfoPanels />, { queryString });

    const panel = screen.getByTestId("query-string");

    expect(panel.innerHTML.length).toBeLessThan(queryString.length);
  });

  it("displays the raw request in the raw request panel", () => {
    const queryString = "hello";
    const resultPreviewUrl = buildResultPreviewUrl({ queryString }).toString();
    render(<InfoPanels />, { queryString });

    const panel = screen.getByTestId("raw-request");

    expect(panel).toHaveTextContent(decodeURIComponent(resultPreviewUrl));
  });
});
