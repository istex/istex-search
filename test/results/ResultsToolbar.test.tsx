import { useRouter } from "next-intl/client";
import ResultsToolbar from "../../src/app/[locale]/results/components/ResultsToolbar";
import {
  mockSearchParams,
  customRender as render,
  screen,
  userEvent,
} from "../test-utils";

describe("ResultsToolbar", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should renders correctly", () => {
    render(<ResultsToolbar columns={2} setColumns={() => {}} />);
    expect(screen.getByText("trier par :")).toBeInTheDocument();
    const sortSelectElement = screen.getByRole("button", {
      name: "pertinence & qualité",
    });
    expect(sortSelectElement).toBeInTheDocument();
    const gridButton = screen.getByLabelText("Affichage en grille");
    expect(gridButton).toBeInTheDocument();
    expect(gridButton).toHaveClass("Mui-selected");
    const listButton = screen.getByLabelText("Affichage en liste");
    expect(listButton).toBeInTheDocument();
    expect(listButton).not.toHaveClass("Mui-selected");
  });

  it("should renders correctly when the sort direction is desc", () => {
    mockSearchParams({
      sortBy: "publicationDate",
      sortDirection: "desc",
    });
    render(<ResultsToolbar columns={2} setColumns={() => {}} />);
    const sortDirButton = screen.getByLabelText("ordre décroissant");
    expect(sortDirButton).toBeInTheDocument();
  });

  it("should renders selected sort field according to the search params", () => {
    mockSearchParams({
      sortBy: "publicationDate",
    });
    render(<ResultsToolbar columns={2} setColumns={() => {}} />);
    const sortSelectElement = screen.getByRole("button", {
      name: "date de publication",
    });
    expect(sortSelectElement).toBeInTheDocument();
  });

  it("should not display sort direction button when the sort field is qualityOverRelevance", () => {
    mockSearchParams({
      sortBy: "qualityOverRelevance",
    });
    render(<ResultsToolbar columns={2} setColumns={() => {}} />);
    const sortDirButton = screen.queryByLabelText("ordre croissant");
    expect(sortDirButton).not.toBeInTheDocument();
  });

  it("should not display sort direction button when the sort field is random", () => {
    mockSearchParams({
      sortBy: "random",
    });
    render(<ResultsToolbar columns={2} setColumns={() => {}} />);
    const sortDirButton = screen.queryByLabelText("ordre croissant");
    expect(sortDirButton).not.toBeInTheDocument();
  });

  it("should display sort direction button when the sort field is publicationDate", () => {
    mockSearchParams({
      sortBy: "publicationDate",
    });
    render(<ResultsToolbar columns={2} setColumns={() => {}} />);
    const sortDirButton = screen.getByLabelText("ordre croissant");
    expect(sortDirButton).toBeInTheDocument();
  });

  it("should display sort direction button when the sort field is title", () => {
    mockSearchParams({
      sortBy: "title.raw",
    });
    render(<ResultsToolbar columns={2} setColumns={() => {}} />);
    const sortDirButton = screen.getByLabelText("ordre croissant");
    expect(sortDirButton).toBeInTheDocument();
  });

  it("should display the sorting options when the sort select is clicked", async () => {
    render(<ResultsToolbar columns={2} setColumns={() => {}} />);
    const sortSelectElement = screen.getByRole("button", {
      name: "pertinence & qualité",
    });
    expect(sortSelectElement).toBeInTheDocument();
    expect(screen.getByText("aléatoire")).not.toBeVisible();
    expect(screen.getByText("date de publication")).not.toBeVisible();
    expect(screen.getByText("titre")).not.toBeVisible();
    await userEvent.click(sortSelectElement);
    expect(screen.getByText("aléatoire")).toBeVisible();
    expect(screen.getByText("date de publication")).toBeVisible();
    expect(screen.getByText("titre")).toBeVisible();
  });

  it("should call router.replace with the correct params when the sort field is changed", async () => {
    const router = useRouter();
    render(<ResultsToolbar columns={2} setColumns={() => {}} />);
    const sortSelectElement = screen.getByRole("button", {
      name: "pertinence & qualité",
    });
    await userEvent.click(sortSelectElement);
    const titleSortOption = screen.getByText("titre");
    await userEvent.click(titleSortOption);
    expect(router.replace).toBeCalledWith("/?sortBy=title.raw");
  });

  it("should call router.replace with the correct params when the sort direction button is clicked", async () => {
    mockSearchParams({
      sortBy: "title.raw",
    });
    const router = useRouter();
    render(<ResultsToolbar columns={2} setColumns={() => {}} />);
    const sortDirButton = screen.getByLabelText("ordre croissant");
    await userEvent.click(sortDirButton);
    expect(router.replace).toBeCalledWith(
      "/?sortBy=title.raw&sortDirection=desc",
    );
  });
});
