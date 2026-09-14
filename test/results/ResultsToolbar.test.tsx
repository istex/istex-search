import ResultsToolbar from "@/app/[locale]/results/components/ResultsToolbar";
import { customRender as render, screen, userEvent } from "../test-utils";

describe("ResultsToolbar", () => {
  it("renders correctly", () => {
    render(<ResultsToolbar columns={2} setColumns={jest.fn()} />);
    expect(screen.getByText("trier par :")).toBeInTheDocument();
    const sortSelectElement = screen.getAllByText("pertinence & qualité")[0];
    expect(sortSelectElement).toBeInTheDocument();
    const gridButton = screen.getByLabelText("Affichage en grille");
    expect(gridButton).toBeInTheDocument();
    expect(gridButton).toHaveClass("Mui-selected");
    const listButton = screen.getByLabelText("Affichage en liste");
    expect(listButton).toBeInTheDocument();
    expect(listButton).not.toHaveClass("Mui-selected");
  });

  it("renders correctly when the sort direction is desc", () => {
    render(
      <ResultsToolbar columns={2} setColumns={jest.fn()} />,
      {},
      { searchParams: { sortBy: "publicationDate", sortDirection: "desc" } },
    );

    const sortDirButton = screen.getByLabelText("ordre décroissant");
    expect(sortDirButton).toBeInTheDocument();
  });

  it("renders the selected sort field according to the search params", () => {
    render(
      <ResultsToolbar columns={2} setColumns={jest.fn()} />,
      {},
      { searchParams: { sortBy: "publicationDate" } },
    );

    const sortSelectElement = screen.getAllByText("date de publication")[0];
    expect(sortSelectElement).toBeInTheDocument();
  });

  it("doesn't display the sort direction button when the sort field is qualityOverRelevance", () => {
    render(
      <ResultsToolbar columns={2} setColumns={jest.fn()} />,
      {},
      { searchParams: { sortBy: "qualityOverRelevance" } },
    );

    const sortDirButton = screen.queryByLabelText("ordre croissant");
    expect(sortDirButton).not.toBeInTheDocument();
  });

  it("doesn't display the sort direction button when the sort field is random", () => {
    render(
      <ResultsToolbar columns={2} setColumns={jest.fn()} />,
      {},
      { searchParams: { sortBy: "random" } },
    );

    const sortDirButton = screen.queryByLabelText("ordre croissant");
    expect(sortDirButton).not.toBeInTheDocument();
  });

  it("displays the sort direction button when the sort field is publicationDate", () => {
    render(
      <ResultsToolbar columns={2} setColumns={jest.fn()} />,
      {},
      { searchParams: { sortBy: "publicationDate" } },
    );

    const sortDirButton = screen.getByLabelText("ordre croissant");
    expect(sortDirButton).toBeInTheDocument();
  });

  it("displays the sort direction button when the sort field is title", () => {
    render(
      <ResultsToolbar columns={2} setColumns={jest.fn()} />,
      {},
      { searchParams: { sortBy: "title.raw" } },
    );
    const sortDirButton = screen.getByLabelText("ordre croissant");
    expect(sortDirButton).toBeInTheDocument();
  });

  it("displays the sorting options when the sort select is clicked", async () => {
    render(<ResultsToolbar columns={2} setColumns={jest.fn()} />);
    const sortSelectElement = screen.getAllByText("pertinence & qualité")[0];
    expect(sortSelectElement).toBeInTheDocument();
    expect(screen.getByText("aléatoire")).not.toBeVisible();
    expect(screen.getByText("date de publication")).not.toBeVisible();
    expect(screen.getByText("titre")).not.toBeVisible();
    await userEvent.click(sortSelectElement);
    expect(screen.getByText("aléatoire")).toBeVisible();
    expect(screen.getByText("date de publication")).toBeVisible();
    expect(screen.getByText("titre")).toBeVisible();
  });

  it("updates the URL when the sort field is changed", async () => {
    const onUrlUpdate = jest.fn();
    render(
      <ResultsToolbar columns={2} setColumns={jest.fn()} />,
      {},
      { onUrlUpdate },
    );

    const sortSelectElement = screen.getAllByText("pertinence & qualité")[0];
    await userEvent.click(sortSelectElement);
    const titleSortOption = screen.getByText("titre");
    await userEvent.click(titleSortOption);

    expect(onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: "?sortBy=title.raw",
        options: expect.objectContaining({ shallow: false, history: "push" }),
      }),
    );
  });

  it("updates the URL when the sort direction button is clicked", async () => {
    const onUrlUpdate = jest.fn();
    render(
      <ResultsToolbar columns={2} setColumns={jest.fn()} />,
      {},
      { searchParams: { sortBy: "title.raw" }, onUrlUpdate },
    );

    const sortDirButton = screen.getByLabelText("ordre croissant");
    await userEvent.click(sortDirButton);

    expect(onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: "?sortBy=title.raw&sortDirection=desc",
        options: expect.objectContaining({ shallow: false, history: "push" }),
      }),
    );
  });
});
