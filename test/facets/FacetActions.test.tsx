import { customRender as render, screen, userEvent } from "../test-utils";
import FacetActions from "@/app/[locale]/results/facets/FacetActions";
import { useFacetContext } from "@/app/[locale]/results/facets/FacetContext";

jest.mock("@/app/[locale]/results/facets/FacetContext", () => ({
  useFacetContext: jest.fn(),
}));

describe("FacetActions", () => {
  const facetTitle = "corpusName";

  afterEach(jest.resetAllMocks);

  it("should render the facet actions correctly", () => {
    const facets = {
      [facetTitle]: [
        { key: "Option 1", docCount: 10, selected: false },
        { key: "Option 2", docCount: 5, selected: false },
        { key: "Option 3", docCount: 3, selected: false },
      ],
    };

    (useFacetContext as jest.Mock).mockReturnValue({
      facetsList: facets,
      facetsWaitingForApply: [],
      clearOneFacet: jest.fn(),
      applyOneFacet: jest.fn(),
    });

    render(<FacetActions facetTitle={facetTitle} />);

    const applyButton = screen.getByRole("button", { name: "Appliquer" });
    const clearButton = screen.getByRole("button", { name: "Effacer" });

    expect(applyButton).toBeInTheDocument();
    expect(clearButton).toBeInTheDocument();
  });

  it("should disable the apply button when no facets waiting for apply", () => {
    const facets = {
      [facetTitle]: [
        { key: "Option 1", docCount: 10, selected: false },
        { key: "Option 2", docCount: 5, selected: false },
        { key: "Option 3", docCount: 3, selected: false },
      ],
    };

    (useFacetContext as jest.Mock).mockReturnValue({
      facetsList: facets,
      facetsWaitingForApply: [],
      clearOneFacet: jest.fn(),
      applyOneFacet: jest.fn(),
    });

    render(<FacetActions facetTitle={facetTitle} />);

    const applyButton = screen.getByRole("button", { name: "Appliquer" });

    expect(applyButton).toBeDisabled();
  });

  it("should enable the apply button when facet waiting for apply", () => {
    const facets = {
      [facetTitle]: [
        { key: "Option 1", docCount: 10, selected: true },
        { key: "Option 2", docCount: 5, selected: false },
        { key: "Option 3", docCount: 3, selected: false },
      ],
    };

    (useFacetContext as jest.Mock).mockReturnValue({
      facetsList: facets,
      facetsWaitingForApply: [facetTitle],
      clearOneFacet: jest.fn(),
      applyOneFacet: jest.fn(),
    });

    render(<FacetActions facetTitle={facetTitle} />);

    const applyButton = screen.getByRole("button", { name: "Appliquer" });

    expect(applyButton).not.toBeDisabled();
  });

  it("should call the applyOneFacet function when the apply button is clicked", async () => {
    const facets = {
      [facetTitle]: [
        { key: "Option 1", docCount: 10, selected: true },
        { key: "Option 2", docCount: 5, selected: false },
        { key: "Option 3", docCount: 3, selected: false },
      ],
    };

    const applyOneFacetMock = jest.fn();

    (useFacetContext as jest.Mock).mockReturnValue({
      facetsList: facets,
      facetsWaitingForApply: [facetTitle],
      clearOneFacet: jest.fn(),
      applyOneFacet: applyOneFacetMock,
    });

    render(<FacetActions facetTitle={facetTitle} />);

    const applyButton = screen.getByRole("button", { name: "Appliquer" });

    await userEvent.click(applyButton);

    expect(applyOneFacetMock).toHaveBeenCalledWith(facetTitle);
  });

  it("should call the clearOneFacet function when the clear button is clicked", async () => {
    const facets = {
      [facetTitle]: [
        { key: "Option 1", docCount: 10, selected: true },
        { key: "Option 2", docCount: 5, selected: false },
        { key: "Option 3", docCount: 3, selected: false },
      ],
    };

    const clearOneFacetMock = jest.fn();

    (useFacetContext as jest.Mock).mockReturnValue({
      facetsList: facets,
      facetsWaitingForApply: [],
      clearOneFacet: clearOneFacetMock,
      applyOneFacet: jest.fn(),
    });

    render(<FacetActions facetTitle={facetTitle} />);

    const clearButton = screen.getByRole("button", { name: "Effacer" });

    await userEvent.click(clearButton);

    expect(clearOneFacetMock).toHaveBeenCalledWith(facetTitle);
  });

  it("should disable the buttons when the disabled prop is true", () => {
    const facets = {
      [facetTitle]: [
        { key: "Option 1", docCount: 10, selected: false },
        { key: "Option 2", docCount: 5, selected: false },
        { key: "Option 3", docCount: 3, selected: false },
      ],
    };

    (useFacetContext as jest.Mock).mockReturnValue({
      facetsList: facets,
      facetsWaitingForApply: [],
      clearOneFacet: jest.fn(),
      applyOneFacet: jest.fn(),
    });

    render(<FacetActions facetTitle={facetTitle} disabled />);

    const applyButton = screen.getByRole("button", { name: "Appliquer" });
    const clearButton = screen.getByRole("button", { name: "Effacer" });

    expect(applyButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });
});
