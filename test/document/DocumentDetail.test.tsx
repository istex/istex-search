import { customRender as render, screen, userEvent } from "../test-utils";
import { useDocumentContext } from "@/app/[locale]/results/Document/DocumentContext";
import DocumentDetail from "@/app/[locale]/results/Document/DocumentDetail";
import type { Result } from "@/lib/istexApi";

jest.mock("@/app/[locale]/results/Document/DocumentContext", () => ({
  useDocumentContext: jest.fn(),
}));

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

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should not render the document details when the displayedDocument is not defined", () => {
    (useDocumentContext as jest.Mock).mockReturnValue({
      displayedDocument: undefined,
    });
    const { container } = render(<DocumentDetail />);
    const drawer = container.querySelector(".MuiDrawer-root");
    expect(drawer).not.toBeInTheDocument();
  });

  it("should render the document details correctly", () => {
    (useDocumentContext as jest.Mock).mockReturnValue({
      displayedDocument: document,
    });
    render(<DocumentDetail />);
    expect(screen.getByText("Document title")).toBeInTheDocument();
    expect(screen.getByText("Host title")).toBeInTheDocument();
    expect(screen.getByText("Author name")).toBeInTheDocument();
    expect(screen.getByText("Genre")).toBeInTheDocument();
    expect(screen.getByText("Abstract")).toBeInTheDocument();
    expect(screen.getByText("Host genre")).toBeInTheDocument();
    expect(screen.getByText("Corpus name")).toBeInTheDocument();
    expect(screen.getByText("2021")).toBeInTheDocument();
    expect(screen.getByText("arkIstex")).toBeInTheDocument();

    expect(screen.getByText("pdf")).toBeInTheDocument();
    const pdfLink = screen.getByText("pdf").closest("a");
    expect(pdfLink).toHaveAttribute("href", "pdfUri");
    expect(pdfLink).toHaveAttribute(
      "title",
      "Accéder au texte intégral au format pdf",
    );

    expect(screen.getByText("zip")).toBeInTheDocument();
    const zipLink = screen.getByText("zip").closest("a");
    expect(zipLink).toHaveAttribute("href", "zipUri");
    expect(zipLink).toHaveAttribute(
      "title",
      "Accéder au texte intégral au format zip",
    );

    expect(screen.getByText("xml")).toBeInTheDocument();
    const xmlLink = screen.getByText("xml").closest("a");
    expect(xmlLink).toHaveAttribute("href", "xmlUri");
    expect(xmlLink).toHaveAttribute(
      "title",
      "Accéder aux métadonnées au format xml",
    );

    expect(screen.getByText("json")).toBeInTheDocument();
    const jsonLink = screen.getByText("json").closest("a");
    expect(jsonLink).toHaveAttribute("href", "jsonUri");
    expect(jsonLink).toHaveAttribute(
      "title",
      "Accéder aux métadonnées au format json",
    );

    expect(screen.getByText("jpg")).toBeInTheDocument();
    const jpgLink = screen.getByText("jpg").closest("a");
    expect(jpgLink).toHaveAttribute("href", "jpgUri");
    expect(jpgLink).toHaveAttribute(
      "title",
      "Accéder à l'annexe au format jpg",
    );

    expect(screen.getByText("nb")).toBeInTheDocument();
    const nbLink = screen.getByText("nb").closest("a");
    expect(nbLink).toHaveAttribute("href", "nbUri");
    expect(nbLink).toHaveAttribute(
      "title",
      "Accéder à l'enrichissement nb au format tei",
    );

    expect(screen.getByText("teeft")).toBeInTheDocument();
    const teeftLink = screen.getByText("teeft").closest("a");
    expect(teeftLink).toHaveAttribute("href", "teeftUri");
    expect(teeftLink).toHaveAttribute(
      "title",
      "Accéder à l'enrichissement teeft au format tei",
    );
  });

  it("should call handleCloseDocument when the close button is clicked", async () => {
    const closeDocumentMock = jest.fn();
    (useDocumentContext as jest.Mock).mockReturnValue({
      displayedDocument: document,
      closeDocument: closeDocumentMock,
    });
    render(<DocumentDetail />);
    const closeButton = screen.getByText("Revenir aux résultats");
    await userEvent.click(closeButton);
    expect(closeDocumentMock).toHaveBeenCalled();
  });
});
