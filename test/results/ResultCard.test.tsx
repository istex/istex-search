import ResultCard from "@/app/[locale]/results/components/ResultCard";
import { SEARCH_MODE_IMPORT } from "@/config";
import type { IstexApiResponse } from "@/lib/istexApi";
import { customRender as render, screen, userEvent } from "../test-utils";

describe("ResultCard", () => {
  it("renders correctly", () => {
    renderResultCard();
    expect(screen.getByText("Document title")).toBeInTheDocument();
    expect(screen.getByText("Host title")).toBeInTheDocument();
    expect(screen.getByText("Author name")).toBeInTheDocument();
    expect(screen.getByText("2010")).toBeInTheDocument();
    expect(screen.getByText("Abstract")).toBeInTheDocument();
  });

  it("displays the file icons when displayIcons is true", () => {
    renderResultCard(true);

    const pdfLink = screen.getByRole("link", {
      name: "Accéder au texte intégral au format PDF",
    });

    expect(pdfLink).toBeInTheDocument();
  });

  it("doesn't display the file icons when displayIcons not true", () => {
    renderResultCard();

    const pdfLink = screen.queryByRole("link", { name: "pdf" });

    expect(pdfLink).not.toBeInTheDocument();
  });

  it("handles selection", async () => {
    renderResultCard();
    const selectButton = screen.getByRole("button", { name: "Sélectionner" });
    const excludeButton = screen.getByRole("button", { name: "Exclure" });
    expect(selectButton).toBeInTheDocument();
    expect(excludeButton).toBeInTheDocument();
    expect(selectButton).toHaveTextContent("Sélectionner");

    await userEvent.click(selectButton);
    expect(selectButton).toHaveTextContent("Désélectionner");
    expect(excludeButton).not.toBeInTheDocument();

    await userEvent.click(selectButton);
    expect(selectButton).toHaveTextContent("Sélectionner");
    const newExcludeButton = screen.getByRole("button", { name: "Exclure" });
    expect(newExcludeButton).toBeInTheDocument();
  });

  it("handles exclusion", async () => {
    renderResultCard();
    const selectButton = screen.getByRole("button", { name: "Sélectionner" });
    const excludeButton = screen.getByRole("button", { name: "Exclure" });
    expect(selectButton).toBeInTheDocument();
    expect(excludeButton).toBeInTheDocument();
    expect(excludeButton).toHaveTextContent("Exclure");

    await userEvent.click(excludeButton);
    expect(excludeButton).toHaveTextContent("Inclure");
    expect(selectButton).not.toBeInTheDocument();

    await userEvent.click(excludeButton);
    expect(excludeButton).toHaveTextContent("Exclure");
    const newSelectButton = screen.getByRole("button", {
      name: "Sélectionner",
    });
    expect(newSelectButton).toBeInTheDocument();
  });

  it("disables the selection and exclusion buttons when in import mode", () => {
    renderResultCard(false, {
      searchParams: { searchMode: SEARCH_MODE_IMPORT },
    });
    const selectButton = screen.getByRole("button", { name: "Sélectionner" });
    const excludeButton = screen.getByRole("button", { name: "Exclure" });

    expect(selectButton).toBeDisabled();
    expect(excludeButton).toBeDisabled();
  });
});

const results: IstexApiResponse = {
  total: 1,
  firstPageURI: "",
  lastPageURI: "",
  hits: [
    {
      id: "123",
      arkIstex: "arkIstex",
      corpusName: "elsevier",
      title: "Document title",
      publicationDate: "2010",
      host: {
        title: "Host title",
      },
      author: [
        {
          name: "Author name",
        },
      ],
      abstract: "Abstract",
      fulltext: [
        {
          uri: "https://example.com",
          extension: "pdf",
        },
      ],
    },
  ],
  aggregations: {},
};

function renderResultCard(
  displayIcons = false,
  nuqsAdapterProps?: Parameters<typeof render>[2],
) {
  render(
    <ResultCard index={0} displayIcons={displayIcons} />,
    { results },
    nuqsAdapterProps,
  );
}
