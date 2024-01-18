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
      excluded: false,
      fromAsString: "2000",
      toAsString: "2020",
    },
  ];

  const facetTitleScore = "qualityIndicators.score";
  const facetItemsScore = [
    {
      key: "1-9",
      docCount: 10,
      selected: false,
      excluded: false,
    },
  ];

  const facets = {
    [facetTitle]: facetItems,
    [facetTitleScore]: facetItemsScore,
  };
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render the range component", () => {
    (useFacetContext as jest.Mock).mockReturnValue({
      facetsList: facets,
      setRangeFacet: jest.fn(),
    });

    render(<FacetRange facetTitle={facetTitle} facetItems={facetItems} />);
    expect(screen.getByText("Année (2000 à 2020)")).toBeInTheDocument();
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

  it("should call setRangeFacet when changing the min value", async () => {
    const setRangeFacetMock = jest.fn();
    (useFacetContext as jest.Mock).mockReturnValue({
      facetsList: facets,
      setRangeFacet: setRangeFacetMock,
    });
    render(<FacetRange facetTitle={facetTitle} facetItems={facetItems} />);
    const minInput = screen.getByPlaceholderText("Minimum");
    fireEvent.change(minInput, { target: { value: "2002" } });
    expect(setRangeFacetMock).toHaveBeenCalledTimes(1);
    expect(setRangeFacetMock).toHaveBeenCalledWith(
      "publicationDate",
      "2002-2020",
    );
  });

  it("should call setRangeFacet when changing the max value", async () => {
    const setRangeFacetMock = jest.fn();
    (useFacetContext as jest.Mock).mockReturnValue({
      facetsList: facets,
      setRangeFacet: setRangeFacetMock,
    });
    render(<FacetRange facetTitle={facetTitle} facetItems={facetItems} />);
    const maxInput = screen.getByPlaceholderText("Maximum");
    fireEvent.change(maxInput, { target: { value: "2005" } });
    expect(setRangeFacetMock).toHaveBeenCalledTimes(1);
    expect(setRangeFacetMock).toHaveBeenCalledWith(
      "publicationDate",
      "2000-2005",
    );
  });

  it("should not update value and call setRangeFacet when changing the min value to a decimal value for non decimal facet", async () => {
    const setRangeFacetMock = jest.fn();
    (useFacetContext as jest.Mock).mockReturnValue({
      facetsList: facets,
      setRangeFacet: setRangeFacetMock,
    });
    render(<FacetRange facetTitle={facetTitle} facetItems={facetItems} />);
    const minInput = screen.getByPlaceholderText("Minimum");
    fireEvent.change(minInput, { target: { value: "1.5" } });
    expect(setRangeFacetMock).toHaveBeenCalledTimes(0);
    expect(minInput).toHaveValue("2000");
  });

  it("should not update value and call setRangeFacet when changing the min value to an outside of range value for score facet", async () => {
    const setRangeFacetMock = jest.fn();

    (useFacetContext as jest.Mock).mockReturnValue({
      facetsList: facets,
      setRangeFacet: setRangeFacetMock,
    });
    render(
      <FacetRange facetTitle={facetTitleScore} facetItems={facetItemsScore} />,
    );
    const minInput = screen.getByPlaceholderText("Minimum");
    fireEvent.change(minInput, { target: { value: "11" } });
    expect(setRangeFacetMock).toHaveBeenCalledTimes(0);
    expect(minInput).toHaveValue("1");
  });

  it("should update value and call setRangeFacet when changing the min value to an inside of range decimal value for score facet", async () => {
    const setRangeFacetMock = jest.fn();

    (useFacetContext as jest.Mock).mockReturnValue({
      facetsList: facets,
      setRangeFacet: setRangeFacetMock,
    });
    render(
      <FacetRange facetTitle={facetTitleScore} facetItems={facetItemsScore} />,
    );
    const minInput = screen.getByPlaceholderText("Minimum");
    fireEvent.change(minInput, { target: { value: "2.3" } });
    expect(setRangeFacetMock).toHaveBeenCalledTimes(1);
    expect(setRangeFacetMock).toHaveBeenCalledWith(
      "qualityIndicators.score",
      "2.3-9",
    );
    expect(minInput).toHaveValue("2.3");
  });
});
