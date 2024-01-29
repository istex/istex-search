import { type ReactNode } from "react";
import {
  mockSearchParams,
  customRender as render,
  screen,
  userEvent,
} from "../test-utils";
import ImportInput from "@/app/[locale]/components/SearchSection/ImportInput";
import SearchBar from "@/app/[locale]/components/SearchSection/SearchBar";
import SearchSection from "@/app/[locale]/components/SearchSection/SearchSection";
import { SEARCH_MODE_ADVANCED } from "@/config";
import { useRouter } from "@/i18n/navigation";

describe("ImportInput", () => {
  const searchBar = (child: ReactNode) => {
    return <SearchBar>{child}</SearchBar>;
  };
  it("should render the ImportInput component", () => {
    render(<ImportInput searchBar={searchBar} goToResultsPage={() => {}} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "placeholder",
      "Collez votre liste d'identifiants* (ARK, DOI, ID Istex) ou importer votre fichier .corpus\n* un seul format à la fois",
    );
    expect(
      screen.getByRole("button", { name: "RECHERCHER" }),
    ).toBeInTheDocument();
  });
  it("goes to the results page with the query string in the URL when clicking the search button", async () => {
    mockSearchParams({
      searchMode: SEARCH_MODE_ADVANCED,
    });
    const router = useRouter();
    render(<SearchSection />);
    const queryString = `ark:/67375/NVC-Z7G9LN4W-1
ark:/67375/NVC-Z7GF9ML4-0
ark:/67375/NVC-Z7GHR58X-4`;

    const input = screen.getByRole("textbox");
    await userEvent.type(input, queryString);

    const button = screen.getByRole("button", { name: "RECHERCHER" });
    await userEvent.click(button);

    expect(router.push).toBeCalledWith(
      `/results?searchMode=advanced&${new URLSearchParams({
        q: 'arkIstex.raw:("ark:/67375/NVC-Z7G9LN4W-1" "ark:/67375/NVC-Z7GF9ML4-0" "ark:/67375/NVC-Z7GHR58X-4")',
      }).toString()}`,
    );
  }, 8000);
});
