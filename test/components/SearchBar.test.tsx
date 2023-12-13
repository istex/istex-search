import { customRender as render, screen } from "../test-utils";
import SearchBar from "@/app/[locale]/components/SearchSection/SearchBar";

describe("SearchBar", () => {
  it("should render the searchBar in regular mode", () => {
    render(
      <SearchBar isSearchById={false} switchSearchMode={() => {}}>
        <></>
      </SearchBar>,
    );
    expect(screen.getByText("RECHERCHER")).toBeInTheDocument();
    expect(screen.getByTestId("search-by-id-button")).toBeInTheDocument();
  });
  it("should render the searchBar in searchById mode", async () => {
    render(
      <SearchBar isSearchById={false} switchSearchMode={() => {}}>
        <></>
      </SearchBar>,
    );
    expect(screen.getByTestId("search-by-id-button")).toHaveStyle(
      "background-color: #f0f0f0",
    );
    expect(screen.getByTestId("search-by-id-button")).toHaveStyle(
      "color: black",
    );
  });
  it("should render the blue 'IMPORT LIST' button when isSearchById is true ", async () => {
    render(
      <SearchBar isSearchById switchSearchMode={() => {}}>
        <></>
      </SearchBar>,
    );
    expect(screen.getByTestId("search-by-id-button")).toHaveStyle(
      "background-color: #458ca5",
    );
    expect(screen.getByTestId("search-by-id-button")).toHaveStyle(
      "color: white",
    );
  });
});
