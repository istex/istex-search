import { fireEvent, customRender as render, screen } from "../test-utils";
import { useFacetContext } from "@/app/[locale]/results/facets/FacetContext";
import FacetRange from "@/app/[locale]/results/facets/FacetRange";

jest.mock("@/app/[locale]/results/facets/FacetContext", () => ({
  useFacetContext: jest.fn(),
}));

describe("FaceRange", () => {
  const facetTitle = "publicationDate";
  const facetItems = [
    {
      key: "2000-2020",
      docCount: 10,
      selected: false,
      fromAsString: "2000",
      toAsString: "2020",
    },
  ];

  const facets = {
    [facetTitle]: facetItems,
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render the range component", () => {
    (useFacetContext as jest.Mock).mockReturnValue({
      facetsList: facets,
    });

    render(<FacetRange facetTitle={facetTitle} facetItems={facetItems} />);
    expect(screen.getByText("Année (de 2000 à 2020)")).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(2);
    expect(screen.getAllByRole("textbox")[0]).toHaveAttribute(
      "placeholder",
      "Minimum",
    );
    expect(screen.getAllByRole("textbox")[0]).toHaveValue("2000");
    expect(screen.getAllByRole("textbox")[1]).toHaveAttribute(
      "placeholder",
      "Maximum",
    );
    expect(screen.getAllByRole("textbox")[1]).toHaveValue("2020");
  });

  it("should call setRangeFacet when changing the max value", async () => {
    const setRangeFacetMock = jest.fn();
    (useFacetContext as jest.Mock).mockReturnValue({
      facetsList: facets,
      setRangeFacet: setRangeFacetMock,
    });
    render(<FacetRange facetTitle={facetTitle} facetItems={facetItems} />);
    const maxInput = screen.getAllByRole("textbox")[1];
    fireEvent.change(maxInput, { target: { value: "2010" } });
    expect(setRangeFacetMock).toHaveBeenCalledTimes(1);
    expect(setRangeFacetMock).toHaveBeenCalledWith("2000-2010");
  });
});
