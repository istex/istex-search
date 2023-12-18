import {
  customRender as render,
  screen,
  userEvent,
  within,
} from "../test-utils";
import FacetAutocomplete from "@/app/[locale]/results/facets/FacetAutocomplete";
import { useFacetContext } from "@/app/[locale]/results/facets/FacetContext";

jest.mock("@/app/[locale]/results/facets/FacetContext", () => ({
  useFacetContext: jest.fn(),
}));

describe("FacetAutocomplete", () => {
  const facetTitle = "language";
  const facetItems = [
    { key: "eng", docCount: 10, selected: false },
    { key: "fre", docCount: 5, selected: true },
    { key: "ger", docCount: 3, selected: true },
  ];

  const facets = {
    [facetTitle]: facetItems,
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render the autocomplete component", () => {
    (useFacetContext as jest.Mock).mockReturnValue({
      facetsList: facets,
    });

    render(
      <FacetAutocomplete facetTitle={facetTitle} facetItems={facetItems} />,
    );
    expect(
      screen.getByLabelText("Entrez la langue désirée"),
    ).toBeInTheDocument();
  });

  it("should render a chip for a selected facet item", () => {
    (useFacetContext as jest.Mock).mockReturnValue({
      facetsList: facets,
    });

    render(
      <FacetAutocomplete facetTitle={facetTitle} facetItems={facetItems} />,
    );
    expect(
      screen.getByText("fre (5)", { selector: ".MuiChip-label" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("ger (3)", { selector: ".MuiChip-label" }),
    ).toBeInTheDocument();
  });

  it("should render the option list when clicking in the autocomplete", async () => {
    (useFacetContext as jest.Mock).mockReturnValue({
      facetsList: facets,
    });

    render(
      <FacetAutocomplete facetTitle={facetTitle} facetItems={facetItems} />,
    );
    const input = screen.getByLabelText("Entrez la langue désirée");
    await userEvent.click(input);
    expect(
      screen.getByText("eng", { selector: "li span" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("fre", { selector: "li span" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("ger", { selector: "li span" }),
    ).toBeInTheDocument();
  });

  it("should call toggleFacet when clicking on an option", async () => {
    const toggleFacetMock = jest.fn();
    (useFacetContext as jest.Mock).mockReturnValue({
      facetsList: facets,
      toggleFacet: toggleFacetMock,
    });

    render(
      <FacetAutocomplete facetTitle={facetTitle} facetItems={facetItems} />,
    );
    const input = screen.getByLabelText("Entrez la langue désirée");
    await userEvent.click(input);
    const option = screen.getByText("eng", { selector: "li span" });
    await userEvent.click(option);
    expect(toggleFacetMock).toHaveBeenCalledTimes(1);
    expect(toggleFacetMock).toHaveBeenCalledWith(facetTitle, "eng");
  });

  it("should call toggleFacet when clicking on a chip", async () => {
    const toggleFacetMock = jest.fn();
    (useFacetContext as jest.Mock).mockReturnValue({
      facetsList: facets,
      toggleFacet: toggleFacetMock,
    });

    render(
      <FacetAutocomplete facetTitle={facetTitle} facetItems={facetItems} />,
    );
    const chip = screen
      .getByText("fre (5)", { selector: ".MuiChip-label" })
      .closest("div");
    const icon = within(chip as HTMLElement).getByTestId("CancelIcon");
    await userEvent.click(icon);
    expect(toggleFacetMock).toHaveBeenCalledTimes(1);
    expect(toggleFacetMock).toHaveBeenCalledWith(facetTitle, "fre");
  });

  it("should call clearOneFacet when clicking on the clear button", async () => {
    const clearOneFacetMock = jest.fn();
    (useFacetContext as jest.Mock).mockReturnValue({
      facetsList: facets,
      clearOneFacet: clearOneFacetMock,
    });

    render(
      <FacetAutocomplete facetTitle={facetTitle} facetItems={facetItems} />,
    );
    const clearButton = screen.getByLabelText("Vider");
    await userEvent.click(clearButton);
    expect(clearOneFacetMock).toHaveBeenCalledTimes(1);
    expect(clearOneFacetMock).toHaveBeenCalledWith(facetTitle);
  });
});
