import {
  mockPathname,
  mockSearchParams,
  customRender as render,
  screen,
  userEvent,
} from "../test-utils";
import SearchTitle from "@/app/[locale]/components/SearchSection/SearchTitle";
import {
  SEARCH_MODE_IMPORT,
  SEARCH_MODE_ASSISTED,
  type SearchMode,
  searchModes,
  SEARCH_MODE_REGULAR,
} from "@/config";
import { useRouter } from "@/i18n/navigation";

describe("SearchTitle", () => {
  it("should render the SearchTitle component", () => {
    render(<SearchTitle />);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();

    for (const searchMode of searchModes) {
      expect(
        screen.getByTestId(`${searchMode}-search-button`),
      ).toBeInTheDocument();
    }
  });

  it("should render the SearchTitle component on regular mode", () => {
    render(<SearchTitle />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Créez votre requête",
    );

    testSearchModeButton(SEARCH_MODE_REGULAR);
  });

  it("should render the SearchTitle component on assisted mode", () => {
    mockSearchParams({
      searchMode: SEARCH_MODE_ASSISTED,
    });
    render(<SearchTitle />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Assistant à la construction de requête",
    );

    testSearchModeButton(SEARCH_MODE_ASSISTED);
  });

  it("should render the SearchTitle component on import mode", () => {
    mockSearchParams({
      searchMode: SEARCH_MODE_IMPORT,
    });
    render(<SearchTitle />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Importez vos identifiants",
    );

    testSearchModeButton(SEARCH_MODE_IMPORT);
  });

  it("should switch search mode to assisted", async () => {
    const router = useRouter();
    render(<SearchTitle />);

    await userEvent.click(screen.getByTestId("assisted-search-button"));
    expect(router.push).toHaveBeenCalledWith("/?searchMode=assisted");
  });

  it("should switch search mode to import", async () => {
    const router = useRouter();
    render(<SearchTitle />);

    await userEvent.click(screen.getByTestId("import-search-button"));
    expect(router.push).toHaveBeenCalledWith("/?searchMode=import");
  });

  it("should switch search mode to regular", async () => {
    const router = useRouter();
    mockSearchParams({
      searchMode: SEARCH_MODE_IMPORT,
    });
    render(<SearchTitle />);

    await userEvent.click(screen.getByTestId("regular-search-button"));
    expect(router.push).toHaveBeenCalledWith("/?");
  });

  it("doesn't render the results count when on the home page", () => {
    render(<SearchTitle />, { resultsCount: 3 });

    const resultsCountText = screen.queryByText("documents trouvés");

    expect(resultsCountText).not.toBeInTheDocument();
  });

  it("renders the results count when not on the home page", () => {
    mockPathname("/results");
    render(<SearchTitle />, { resultsCount: 3 });

    const resultsCountText = screen.getByText("documents trouvés");

    expect(resultsCountText).toBeInTheDocument();
  });
});

function testSearchModeButton(searchMode: SearchMode) {
  for (const mode of searchModes) {
    const button = screen.getByTestId(`${mode}-search-button`);

    expect(getComputedStyle(button).border).toBe(
      mode === searchMode ? "1px solid #458ca5" : "0px",
    );
  }
}
