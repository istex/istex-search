import SearchTitle from "@/app/[locale]/components/SearchSection/SearchTitle";
import { SEARCH_MODE_ASSISTED } from "@/config";
import { useRouter } from "@/i18n/routing";
import type { IstexApiResponse } from "@/lib/istexApi";
import {
  mockPathname,
  mockSearchParams,
  customRender as render,
  screen,
  userEvent,
} from "../test-utils";

describe("SearchTitle", () => {
  it("highlights the currently selected search mode", () => {
    mockSearchParams({
      searchMode: SEARCH_MODE_ASSISTED,
    });
    render(<SearchTitle />);

    const regularButton = getRegularButton();
    const assistedButton = getAssistedButton();
    const importButton = getImportButton();

    expect(regularButton).toHaveAttribute("aria-pressed", "false");
    expect(assistedButton).toHaveAttribute("aria-pressed", "true");
    expect(importButton).toHaveAttribute("aria-pressed", "false");
  });

  it("doesn't change the search mode when clicking on the currently selected search mode", async () => {
    const router = useRouter();
    render(<SearchTitle />);

    const regularButton = getRegularButton();
    await userEvent.click(regularButton);

    expect(router.push).not.toHaveBeenCalled();
  });

  it("changes the search mode when clicking on a different search mode button", async () => {
    const router = useRouter();
    render(<SearchTitle />);

    const assistedButton = getAssistedButton();
    await userEvent.click(assistedButton);

    expect(router.push).toHaveBeenCalledWith(
      `/?searchMode=${SEARCH_MODE_ASSISTED}`,
    );
  });

  it("doesn't render the results count when on the home page", () => {
    mockPathname("/");
    render(<SearchTitle />);

    const resultCountText = screen.queryByText("documents trouvés");

    expect(resultCountText).not.toBeInTheDocument();
  });

  it("renders the results count when not on the home page", () => {
    const results: IstexApiResponse = {
      total: 3,
      hits: [],
      aggregations: {},
    };
    mockPathname("/results");
    render(<SearchTitle />, { results });

    const resultCountText = screen.getByText("documents trouvés");

    expect(resultCountText).toBeInTheDocument();
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });
});

function getRegularButton() {
  return screen.getByRole("button", { name: "Recherche simple" });
}

function getAssistedButton() {
  return screen.getByRole("button", { name: "Recherche assistée" });
}

function getImportButton() {
  return screen.getByRole("button", { name: "Import de liste" });
}
