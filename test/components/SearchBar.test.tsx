import { customRender as render, screen } from "../test-utils";
import SearchBar from "@/app/[locale]/components/SearchSection/SearchBar";

describe("SearchBar", () => {
  it("should render the searchBar", () => {
    render(
      <SearchBar>
        <></>
      </SearchBar>,
    );
    expect(screen.getByText("RECHERCHER")).toBeInTheDocument();
  });
  it("should display a spinner when loading", () => {
    render(
      <SearchBar loading>
        <></>
      </SearchBar>,
    );
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
