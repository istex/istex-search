import { type ReactNode } from "react";
import { customRender as render, screen } from "../test-utils";
import ImportInput from "@/app/[locale]/components/SearchSection/ImportInput";
import SearchBar from "@/app/[locale]/components/SearchSection/SearchBar";

describe("ImportInput", () => {
  it("should render the ImportInput component", () => {
    const searchBar = (child: ReactNode) => {
      return (
        <SearchBar isSearchById={false} switchSearchMode={() => {}}>
          {child}
        </SearchBar>
      );
    };
    render(<ImportInput searchBar={searchBar} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "placeholder",
      "Copiez/collez dans la zone de recherche votre liste d'identifiants (ARK, DOI, ID istex) ou importez votre fichier .corpus\n* un seul format à la fois",
    );
    expect(
      screen.getByRole("button", { name: "RECHERCHER" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("search-by-id-button")).toBeInTheDocument();
  });
});
