import { customRender as render, screen } from "../test-utils";
import SearchBar from "@/app/[locale]/components/SearchSection/SearchBar";

describe("SearchBar", () => {
  it("should render the SearchBar", () => {
    render(
      <SearchBar>
        <></>
      </SearchBar>,
    );
    expect(screen.getByText("Rechercher")).toBeInTheDocument();
  });
});
