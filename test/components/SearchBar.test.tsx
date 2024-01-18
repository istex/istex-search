import { customRender as render, screen } from "../test-utils";
import SearchBar from "@/app/[locale]/components/SearchSection/SearchBar";

describe("SearchBar", () => {
  it("should render the searchBar in regular mode", () => {
    render(
      <SearchBar
        isSearchById={false}
        switchAssistedSearch={() => {}}
        switchSearchById={() => {}}
      >
        <></>
      </SearchBar>,
    );
    expect(screen.getByText("RECHERCHER")).toBeInTheDocument();
    expect(screen.getByTestId("search-by-id-button")).toBeInTheDocument();
    expect(screen.getByTestId("assist-search-button")).toBeInTheDocument();
  });
  it("should render the searchBar in not searchById mode", async () => {
    render(
      <SearchBar
        isSearchById={false}
        switchAssistedSearch={() => {}}
        switchSearchById={() => {}}
      >
        <></>
      </SearchBar>,
    );
    expect(screen.getByTestId("search-by-id-button")).toHaveStyle(
      "background-color: rgb(246, 249, 250)",
    );
    expect(screen.getByTestId("search-by-id-button")).toHaveStyle(
      "color: rgb(29, 29, 29)",
    );
  });
  it("should render the blue 'IMPORT LIST' button when isSearchById is true ", async () => {
    render(
      <SearchBar
        isSearchById
        switchAssistedSearch={() => {}}
        switchSearchById={() => {}}
      >
        <></>
      </SearchBar>,
    );
    expect(screen.getByTestId("search-by-id-button")).toHaveStyle(
      "background-color: rgb(69, 140, 165)",
    );
    expect(screen.getByTestId("search-by-id-button")).toHaveStyle(
      "color: rgb(240, 240, 240)",
    );
  });
  it("should display a spinner when loading", () => {
    render(
      <SearchBar
        isSearchById
        switchAssistedSearch={() => {}}
        switchSearchById={() => {}}
        loading
      >
        <></>
      </SearchBar>,
    );
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
