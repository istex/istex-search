import { fireEvent, customRender as render, screen } from "../test-utils";
import { useFacetContext } from "@/app/[locale]/results/facets/FacetContext";
import FacetsContainer from "@/app/[locale]/results/facets/FacetsContainer";

jest.mock("@/app/[locale]/results/facets/FacetContext", () => ({
  useFacetContext: jest.fn(),
}));

describe("FacetsContainer", () => {
  const facetTitle = "corpusName";
  const facetItems = [
    { key: "Option 1", docCount: 10, selected: false },
    { key: "Option 2", docCount: 5, selected: true },
    { key: "Option 3", docCount: 3, selected: false },
  ];

  const facets = {
    [facetTitle]: facetItems,
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should call clearAllFacets when clear all button is clicked", () => {
    const clearAllFacetsMock = jest.fn();

    (useFacetContext as jest.Mock).mockReturnValue({
      facetsList: facets,
      facetsWaitingForApply: [],
      clearAllFacets: clearAllFacetsMock,
    });

    render(<FacetsContainer />);

    const clearAllButton = screen.getByText("Effacer tout");
    fireEvent.click(clearAllButton);
    expect(clearAllFacetsMock).toHaveBeenCalledTimes(1);
  });
});
