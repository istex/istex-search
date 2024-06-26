import {
  customRender as render,
  mockSearchParams,
  screen,
  userEvent,
} from "../test-utils";
import { useFacetContext } from "@/app/[locale]/results/components/Facets/FacetContext";
import FacetsContainer from "@/app/[locale]/results/components/Facets/FacetsContainer";

jest.mock("@/app/[locale]/results/components/Facets/FacetContext", () => ({
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

  it("should call clearAllFacets when clear all button is clicked", async () => {
    const clearAllFacetsMock = jest.fn();

    (useFacetContext as jest.Mock).mockReturnValue({
      facetsList: facets,
      facetsWaitingForApply: [],
      clearAllFacets: clearAllFacetsMock,
    });

    mockSearchParams({
      filter: `{"${facetTitle}": ["elsevier"]}`,
    });

    render(<FacetsContainer />);

    const clearAllButton = screen.getByText("Effacer tout");
    await userEvent.click(clearAllButton);
    expect(clearAllFacetsMock).toHaveBeenCalledTimes(1);
  });
});
