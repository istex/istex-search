import { type ReactNode } from "react";
import { customRender as render, screen } from "../test-utils";
import ImportInput from "@/app/[locale]/components/SearchSection/ImportInput";
import SearchBar from "@/app/[locale]/components/SearchSection/SearchBar";

describe("ImportInput", () => {
  it("should render the ImportInput component", () => {
    const searchBar = (child: ReactNode) => {
      return (
        <SearchBar
          isSearchById={false}
          switchSearchById={() => {}}
          switchAssistedSearch={() => {}}
        >
          {child}
        </SearchBar>
      );
    };
    render(<ImportInput searchBar={searchBar} goToResultsPage={() => {}} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "placeholder",
      "Collez votre liste d'identifiants* (ARK, DOI, ID Istex) ou importer votre fichier .corpus\n* un seul format à la fois",
    );
    expect(
      screen.getByRole("button", { name: "RECHERCHER" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("search-by-id-button")).toBeInTheDocument();
  });
});
