import {
  fireEvent,
  mockSearchParams,
  customRender as render,
  screen,
  userEvent,
} from "../test-utils";
import { useFacetContext } from "@/app/[locale]/results/components/Facets/FacetContext";
import FacetRange from "@/app/[locale]/results/components/Facets/FacetRange";

jest.mock("@/app/[locale]/results/components/Facets/FacetContext", () => ({
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

  it("should call setRangeFacet when changing the min value", () => {
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

  it("should call setRangeFacet when changing the max value", () => {
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
    await userEvent.clear(minInput);
    await userEvent.type(minInput, "2.3");
    expect(setRangeFacetMock).toHaveBeenCalledWith(
      "qualityIndicators.score",
      "2.3-9",
    );
    expect(minInput).toHaveValue("2,3");
  });

  it("should not render selector if facet is not publicationDate", () => {
    (useFacetContext as jest.Mock).mockReturnValue({
      facetsList: facets,
      setRangeFacet: jest.fn(),
    });
    render(
      <FacetRange facetTitle={facetTitleScore} facetItems={facetItemsScore} />,
    );
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
  });

  it("should toggle the range option when clicking on the selector", () => {
    const setRangeFacetMock = jest.fn();
    (useFacetContext as jest.Mock).mockReturnValue({
      facetsList: facets,
      setRangeFacet: setRangeFacetMock,
    });
    render(<FacetRange facetTitle={facetTitle} facetItems={facetItems} />);
    const periodButton = screen.getByRole("tab", {
      name: "Période",
    });
    const yearButton = screen.getByRole("tab", {
      name: "Année",
    });
    expect(periodButton).toBeInTheDocument();
    expect(yearButton).toBeInTheDocument();
    expect(periodButton).toHaveClass("Mui-selected");
    expect(yearButton).not.toHaveClass("Mui-selected");
    expect(screen.getByPlaceholderText("Minimum")).toHaveValue("2000");
    expect(screen.getByPlaceholderText("Maximum")).toHaveValue("2020");
    fireEvent.click(yearButton);
    expect(periodButton).not.toHaveClass("Mui-selected");
    expect(yearButton).toHaveClass("Mui-selected");
    expect(screen.getByPlaceholderText("Année")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Année")).toHaveValue("");
    expect(screen.queryByPlaceholderText("Minimum")).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Maximum")).not.toBeInTheDocument();
  });

  it("should update value and call setRangeFacet when changing the single value", () => {
    const setRangeFacetMock = jest.fn();
    (useFacetContext as jest.Mock).mockReturnValue({
      facetsList: facets,
      setRangeFacet: setRangeFacetMock,
    });
    render(<FacetRange facetTitle={facetTitle} facetItems={facetItems} />);
    const yearButton = screen.getByRole("tab", {
      name: "Année",
    });
    fireEvent.click(yearButton);
    const singleInput = screen.getByPlaceholderText("Année");
    fireEvent.change(singleInput, { target: { value: "2005" } });
    expect(setRangeFacetMock).toHaveBeenCalledTimes(1);
    expect(setRangeFacetMock).toHaveBeenCalledWith(
      "publicationDate",
      "2005-2005",
    );
  });

  it("should render the range component with single value if min and max are the same from filters", () => {
    mockSearchParams({
      filter: JSON.stringify({ publicationDate: ["2008-2008"] }),
    });
    (useFacetContext as jest.Mock).mockReturnValue({
      facetsList: facets,
      setRangeFacet: jest.fn(),
    });

    render(<FacetRange facetTitle={facetTitle} facetItems={facetItems} />);
    const yearButton = screen.getByRole("tab", {
      name: "Année",
    });
    expect(yearButton).toBeInTheDocument();
    expect(yearButton).toHaveClass("Mui-selected");
    expect(screen.getByPlaceholderText("Année")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Année")).toHaveValue("2008");
    expect(screen.queryByPlaceholderText("Minimum")).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Maximum")).not.toBeInTheDocument();
  });

  it("should render the range component with single value if min and max are the same from facets", () => {
    (useFacetContext as jest.Mock).mockReturnValue({
      facetsList: {
        ...facets,
        [facetTitle]: [{ ...facetItems[0], key: "2010-2010" }],
      },
      setRangeFacet: jest.fn(),
    });

    render(
      <FacetRange
        facetTitle={facetTitle}
        facetItems={[{ ...facetItems[0], key: "2010-2010" }]}
      />,
    );
    const yearButton = screen.getByRole("tab", {
      name: "Année",
    });
    expect(yearButton).toBeInTheDocument();
    expect(yearButton).toHaveClass("Mui-selected");
    expect(screen.getByPlaceholderText("Année")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Année")).toHaveValue("2010");
    expect(screen.queryByPlaceholderText("Minimum")).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Maximum")).not.toBeInTheDocument();
  });
});
