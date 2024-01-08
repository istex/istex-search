import { useRouter } from "next-intl/client";
import {
  fireEvent,
  mockSearchParams,
  customRender as render,
  screen,
  within,
} from "../test-utils";
import Filters from "@/app/[locale]/results/Filters/Filters";
import { type Filter } from "@/lib/istexApi";

describe("Filters", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render null if no filters are present", () => {
    const mockedFilter: Filter = {};
    mockSearchParams({
      filter: JSON.stringify(mockedFilter),
    });
    const { container } = render(<Filters />);
    expect(container.firstChild).toBeNull();
  });

  it("should render a chip for each filter value", () => {
    const mockedFilter: Filter = {
      corpusName: ["corpus1", "corpus2"],
      language: ["eng", "fre"],
    };
    mockSearchParams({
      filter: JSON.stringify(mockedFilter),
    });
    render(<Filters />);
    expect(
      screen.getByText("corpus1", { selector: ".MuiChip-label" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("corpus2", { selector: ".MuiChip-label" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("eng", { selector: ".MuiChip-label" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("fre", { selector: ".MuiChip-label" }),
    ).toBeInTheDocument();
  });

  it("should handle filter deletion correctly", () => {
    const router = useRouter();
    const mockedFilter: Filter = {
      corpusName: ["corpus1", "corpus2"],
      language: ["eng", "fre"],
    };
    mockSearchParams({
      filter: JSON.stringify(mockedFilter),
    });
    render(<Filters />);
    const filterChip = screen.getByText("eng").closest("div");
    const clearIcon = within(filterChip as HTMLElement).getByTitle(
      "Supprimer le filtre «eng»",
    );
    fireEvent.click(clearIcon);

    expect(router.push).toHaveBeenCalledWith(
      "/results?filter=%7B%22corpusName%22%3A%5B%22corpus1%22%2C%22corpus2%22%5D%2C%22language%22%3A%5B%22fre%22%5D%7D&lastAppliedFacet=language",
    );
  });

  it("should handle filter deletion correctly when there is only one filter value", () => {
    const router = useRouter();
    const mockedFilter: Filter = {
      corpusName: ["corpus1"],
      language: ["eng"],
    };
    mockSearchParams({
      filter: JSON.stringify(mockedFilter),
    });
    render(<Filters />);
    const filterChip = screen.getByText("eng").closest("div");
    const clearIcon = within(filterChip as HTMLElement).getByTitle(
      "Supprimer le filtre «eng»",
    );
    fireEvent.click(clearIcon);

    expect(router.push).toHaveBeenCalledWith(
      "/results?filter=%7B%22corpusName%22%3A%5B%22corpus1%22%5D%7D&lastAppliedFacet=language",
    );
  });

  it("should display chip with NOT prefix when filter value is excluded", () => {
    const mockedFilter: Filter = {
      corpusName: ["corpus1", "!corpus2"],
    };
    mockSearchParams({
      filter: JSON.stringify(mockedFilter),
    });
    render(<Filters />);
    const tag = screen.getByText("corpus2", { selector: ".MuiChip-label" });
    expect(tag.textContent).toBe("NOTcorpus2");
  });

  it("should handle filter toggle correctly", () => {
    const router = useRouter();
    const mockedFilter: Filter = {
      corpusName: ["corpus1"],
    };
    mockSearchParams({
      filter: JSON.stringify(mockedFilter),
    });
    render(<Filters />);
    const tag = screen.getByText("corpus1", { selector: ".MuiChip-label" });
    expect(tag.textContent).toBe("corpus1");
    fireEvent.click(tag);

    expect(router.push).toHaveBeenCalledWith(
      "/results?filter=%7B%22corpusName%22%3A%5B%22%21corpus1%22%5D%7D",
    );
  });
});
