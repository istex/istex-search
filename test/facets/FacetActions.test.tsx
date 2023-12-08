import { fireEvent, customRender as render, screen } from "../test-utils";
import FacetActions from "@/app/[locale]/results/facets/FacetActions";
import { useFacetContext } from "@/app/[locale]/results/facets/FacetContext";

jest.mock("@/app/[locale]/results/facets/FacetContext", () => ({
  useFacetContext: jest.fn(),
}));

describe("FacetActions", () => {
  const facetTitle = "corpusName";

  afterEach(() => {
    jest.resetAllMocks();
  });

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
      clearOneFacet: jest.fn(),
      applyOneFacet: jest.fn(),
    });

    render(<FacetActions facetTitle={facetTitle} />);

    const applyButton = screen.getByText("Appliquer");
    const clearButton = screen.getByTitle("Effacer");

    expect(applyButton).toBeInTheDocument();
    expect(clearButton).toBeInTheDocument();
  });

  it("should disable the apply button when no facet item is selected", () => {
    const facets = {
      [facetTitle]: [
        { key: "Option 1", docCount: 10, selected: false },
        { key: "Option 2", docCount: 5, selected: false },
        { key: "Option 3", docCount: 3, selected: false },
      ],
    };

    (useFacetContext as jest.Mock).mockReturnValue({
      facetsList: facets,
      clearOneFacet: jest.fn(),
      applyOneFacet: jest.fn(),
    });

    render(<FacetActions facetTitle={facetTitle} />);

    const applyButton = screen.getByText("Appliquer");

    expect(applyButton).toBeDisabled();
  });

  it("should enable the apply button when at least one facet item is selected", () => {
    const facets = {
      [facetTitle]: [
        { key: "Option 1", docCount: 10, selected: true },
        { key: "Option 2", docCount: 5, selected: false },
        { key: "Option 3", docCount: 3, selected: false },
      ],
    };

    (useFacetContext as jest.Mock).mockReturnValue({
      facetsList: facets,
      clearOneFacet: jest.fn(),
      applyOneFacet: jest.fn(),
    });

    render(<FacetActions facetTitle={facetTitle} />);

    const applyButton = screen.getByText("Appliquer");

    expect(applyButton).not.toBeDisabled();
  });

  it("should call the applyOneFacet function when the apply button is clicked", () => {
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
      clearOneFacet: jest.fn(),
      applyOneFacet: applyOneFacetMock,
    });

    render(<FacetActions facetTitle={facetTitle} />);

    const applyButton = screen.getByText("Appliquer");

    fireEvent.click(applyButton);

    expect(applyOneFacetMock).toHaveBeenCalledWith(facetTitle);
  });

  it("should call the clearOneFacet function when the clear button is clicked", () => {
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
      clearOneFacet: clearOneFacetMock,
      applyOneFacet: jest.fn(),
    });

    render(<FacetActions facetTitle={facetTitle} />);

    const clearButton = screen.getByTitle("Effacer");

    fireEvent.click(clearButton);

    expect(clearOneFacetMock).toHaveBeenCalledWith(facetTitle);
  });
});
