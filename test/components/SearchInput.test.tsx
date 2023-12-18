import { useRouter } from "next-intl/client";
import { customRender as render, screen, userEvent } from "../test-utils";
import SearchInput from "@/app/[locale]/components/SearchSection/SearchInput";

describe("SearchInput", () => {
  it("should render the regular search input", () => {
    const { container } = render(<SearchInput />);
    expect(
      container.querySelector("#regular-search-input"),
    ).toBeInTheDocument();
  });

  it("should render the import search input when clicking on 'IMPORT LIST' button", async () => {
    const { container } = render(<SearchInput />);
    const switchSearchMode = screen.getByTestId("search-by-id-button");
    await userEvent.click(switchSearchMode);
    expect(
      container.querySelector("#regular-search-input"),
    ).not.toBeInTheDocument();
    expect(container.querySelector("#import-search-input")).toBeInTheDocument();
  });

  it("should render again the regular search input when clicking two times on 'IMPORT LIST' button", async () => {
    const { container } = render(<SearchInput />);
    await userEvent.click(screen.getByTestId("search-by-id-button"));
    expect(
      container.querySelector("#regular-search-input"),
    ).not.toBeInTheDocument();
    expect(container.querySelector("#import-search-input")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("search-by-id-button"));
    expect(
      container.querySelector("#regular-search-input"),
    ).toBeInTheDocument();
    expect(
      container.querySelector("#import-search-input"),
    ).not.toBeInTheDocument();
  });

  it("goes to the results page with the query string in the URL when clicking the search button", async () => {
    const router = useRouter();
    render(<SearchInput />);
    const queryString = `ark:/67375/NVC-Z7G9LN4W-1
ark:/67375/NVC-Z7GF9ML4-0
ark:/67375/NVC-Z7GHR58X-4`;

    await userEvent.click(screen.getByTestId("search-by-id-button"));

    const input = screen.getByRole("textbox");
    await userEvent.type(input, queryString);

    const button = screen.getByRole("button", { name: "RECHERCHER" });
    await userEvent.click(button);

    expect(router.push).toBeCalledWith(
      `/results?q=${encodeURIComponent(
        'arkIstex:("ark:/67375/NVC-Z7G9LN4W-1","ark:/67375/NVC-Z7GF9ML4-0","ark:/67375/NVC-Z7GHR58X-4")',
      )
        .replace("(", "%28")
        .replace(")", "%29")}`,
    );
  }, 8000);
});
