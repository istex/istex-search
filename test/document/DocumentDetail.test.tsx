import {
  customRender as render,
  screen,
  userEvent,
  waitFor,
  within,
} from "../test-utils";
import DocumentDetail from "@/app/[locale]/results/Document/DocumentDetail";
import ResultCard from "@/app/[locale]/results/components/ResultCard";
import type { IstexApiResponse, Result } from "@/lib/istexApi";

describe("DocumentDetail", () => {
  const document: Result = {
    id: "123",
    title: "Document title",
    host: {
      title: "Host title",
      genre: ["Host genre"],
    },
    author: [
      {
        name: "Author name",
      },
    ],
    genre: ["Genre"],
    abstract: "Abstract",
    corpusName: "Corpus name",
    publicationDate: "2021",
    arkIstex: "arkIstex",
    fulltext: [
      { extension: "pdf", uri: "pdfUri" },
      { extension: "zip", uri: "zipUri" },
    ],
    metadata: [
      { extension: "xml", uri: "xmlUri" },
      { extension: "json", uri: "jsonUri" },
    ],
    annexes: [{ extension: "jpg", uri: "jpgUri" }],
    enrichments: {
      nb: [
        {
          extension: "tei",
          uri: "nbUri",
        },
      ],
      teeft: [
        {
          extension: "tei",
          uri: "teeftUri",
        },
      ],
    },
  };

  const results: IstexApiResponse = {
    total: 1,
    hits: [document],
    aggregations: {},
  };

  it("should not render the document details when the displayedDocument is not defined", () => {
    const { container } = render(<DocumentDetail />);
    const drawer = container.querySelector(".MuiDrawer-root");
    expect(drawer).not.toBeInTheDocument();
  });

  it("should render the document details correctly", async () => {
    render(
      <>
        <ResultCard info={document} />
        <DocumentDetail />
      </>,
      { results },
    );
    const card = screen.getByText("Document title").closest("button");
    if (card != null) {
      await userEvent.click(card);
    }
    const drawer = screen.getByRole("presentation");
    expect(drawer).toBeInTheDocument();
    expect(within(drawer).getByText("Document title")).toBeInTheDocument();
    expect(within(drawer).getByText("Host title")).toBeInTheDocument();
    expect(within(drawer).getByText("Author name")).toBeInTheDocument();
    expect(within(drawer).getByText("Genre")).toBeInTheDocument();
    expect(within(drawer).getByText("Abstract")).toBeInTheDocument();
    expect(within(drawer).getByText("Host genre")).toBeInTheDocument();
    expect(within(drawer).getByText("Corpus name")).toBeInTheDocument();
    expect(within(drawer).getByText("2021")).toBeInTheDocument();
    expect(within(drawer).getByText("arkIstex")).toBeInTheDocument();

    expect(within(drawer).getByText("pdf")).toBeInTheDocument();
    const pdfLink = within(drawer).getByText("pdf").closest("a");
    expect(pdfLink).toHaveAttribute("href", "pdfUri");
    expect(pdfLink).toHaveAttribute(
      "title",
      "Accéder au texte intégral au format pdf",
    );

    expect(within(drawer).getByText("zip")).toBeInTheDocument();
    const zipLink = within(drawer).getByText("zip").closest("a");
    expect(zipLink).toHaveAttribute("href", "zipUri");
    expect(zipLink).toHaveAttribute(
      "title",
      "Accéder au texte intégral au format zip",
    );

    expect(within(drawer).getByText("xml")).toBeInTheDocument();
    const xmlLink = within(drawer).getByText("xml").closest("a");
    expect(xmlLink).toHaveAttribute("href", "xmlUri");
    expect(xmlLink).toHaveAttribute(
      "title",
      "Accéder aux métadonnées au format xml",
    );

    expect(within(drawer).getByText("json")).toBeInTheDocument();
    const jsonLink = within(drawer).getByText("json").closest("a");
    expect(jsonLink).toHaveAttribute("href", "jsonUri");
    expect(jsonLink).toHaveAttribute(
      "title",
      "Accéder aux métadonnées au format json",
    );

    expect(within(drawer).getByText("jpg")).toBeInTheDocument();
    const jpgLink = within(drawer).getByText("jpg").closest("a");
    expect(jpgLink).toHaveAttribute("href", "jpgUri");
    expect(jpgLink).toHaveAttribute(
      "title",
      "Accéder à l'annexe au format jpg",
    );

    expect(within(drawer).getByText("nb")).toBeInTheDocument();
    const nbLink = within(drawer).getByText("nb").closest("a");
    expect(nbLink).toHaveAttribute("href", "nbUri");
    expect(nbLink).toHaveAttribute(
      "title",
      "Accéder à l'enrichissement nb au format tei",
    );

    expect(within(drawer).getByText("teeft")).toBeInTheDocument();
    const teeftLink = within(drawer).getByText("teeft").closest("a");
    expect(teeftLink).toHaveAttribute("href", "teeftUri");
    expect(teeftLink).toHaveAttribute(
      "title",
      "Accéder à l'enrichissement teeft au format tei",
    );
  });

  it("should call handleCloseDocument when the close button is clicked", async () => {
    render(
      <>
        <ResultCard info={document} />
        <DocumentDetail />
      </>,
      { results },
    );
    const card = screen.getByText("Document title").closest("button");
    if (card != null) {
      await userEvent.click(card);
    }
    const drawer = screen.getByRole("presentation");
    expect(drawer).toBeInTheDocument();
    const closeButton = within(drawer).getByText("Revenir aux résultats");
    await userEvent.click(closeButton);
    await waitFor(() => {
      expect(drawer).not.toBeInTheDocument();
    });
  });

  it("should toggle the selection when the select button is clicked", async () => {
    render(
      <>
        <ResultCard info={document} />
        <DocumentDetail />
      </>,
      { results },
    );
    const card = screen.getByText("Document title").closest("button");
    if (card != null) {
      await userEvent.click(card);
    }
    const drawer = screen.getByRole("presentation");
    expect(drawer).toBeInTheDocument();
    const selectButton = within(drawer).getByText("Sélectionner ce document");
    const excludeButton = within(drawer).getByText("Exclure ce document");
    await userEvent.click(selectButton);
    expect(selectButton).toHaveTextContent("Dé-sélectionner ce document");
    expect(excludeButton).toBeDisabled();
    await userEvent.click(selectButton);
    expect(selectButton).toHaveTextContent("Sélectionner ce document");
    expect(excludeButton).not.toBeDisabled();
  });

  it("should toggle the exclusion when the exclude button is clicked", async () => {
    render(
      <>
        <ResultCard info={document} />
        <DocumentDetail />
      </>,
      { results },
    );
    const card = screen.getByText("Document title").closest("button");
    if (card != null) {
      await userEvent.click(card);
    }
    const drawer = screen.getByRole("presentation");
    expect(drawer).toBeInTheDocument();
    const selectButton = within(drawer).getByText("Sélectionner ce document");
    const excludeButton = within(drawer).getByText("Exclure ce document");
    await userEvent.click(excludeButton);
    expect(excludeButton).toHaveTextContent("Inclure ce document");
    expect(selectButton).toBeDisabled();
    await userEvent.click(excludeButton);
    expect(excludeButton).toHaveTextContent("Exclure ce document");
    expect(selectButton).not.toBeDisabled();
  });
});
