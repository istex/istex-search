import SearchSection from "@/app/[locale]/components/SearchSection/SearchSection";
import { SEARCH_MODE_ASSISTED, SEARCH_MODE_IMPORT } from "@/config";
import { customRender as render, screen } from "../test-utils";

describe("SearchSection", () => {
  it("renders the RegularSearchInput by default", () => {
    render(<SearchSection />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Créez votre requête",
    );
  });

  it("renders the ImportInput when the searchMode is import", () => {
    render(
      <SearchSection />,
      {},
      { searchParams: { searchMode: SEARCH_MODE_IMPORT } },
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Importez vos identifiants",
    );
  });

  it("renders the AssistedSearchInput when the searchMode is assisted", () => {
    render(
      <SearchSection />,
      {},
      { searchParams: { searchMode: SEARCH_MODE_ASSISTED } },
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Assistant à la construction de requête",
    );
  });
});
