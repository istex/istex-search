import {
  mockSearchParams,
  customRender as render,
  screen,
} from "../test-utils";
import SearchSection from "@/app/[locale]/components/SearchSection/SearchSection";
import { SEARCH_MODE_ADVANCED, SEARCH_MODE_ASSISTED } from "@/config";

describe("SearchSection", () => {
  it("should render the RegularSearchInput", () => {
    render(<SearchSection />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Créez votre requête",
    );
  });
  it("should render the ImportInput", () => {
    mockSearchParams({
      searchMode: SEARCH_MODE_ADVANCED,
    });
    render(<SearchSection />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Importez vos identifiants",
    );
  });
  it("should render the AssistedSearchInput", () => {
    mockSearchParams({
      searchMode: SEARCH_MODE_ASSISTED,
    });
    render(<SearchSection />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Assistant à la construction de requête",
    );
  });
});
