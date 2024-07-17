import {
  customRender as render,
  screen,
  userEvent,
  waitFor,
  within,
} from "../test-utils";
import DocumentDetail from "@/app/[locale]/results/components/Document/DocumentDetail";
import ResultCard from "@/app/[locale]/results/components/ResultCard";
import { corpusWithExternalFulltextLink } from "@/config";
import type { IstexApiResponse, Result } from "@/lib/istexApi";

describe("DocumentDetail", () => {
  it("doesn't render the document details when the displayedDocument is not defined", () => {
    const { container } = render(<DocumentDetail />);
    const drawer = container.querySelector(".MuiDrawer-root");
    expect(drawer).not.toBeInTheDocument();
  });

  it("renders the document details correctly", async () => {
    await renderDocumentDetail();

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
    expect(pdfLink).toHaveAttribute("href", dummyUriWithSid);
    expect(pdfLink).toHaveAttribute(
      "title",
      "Accéder au texte intégral au format PDF",
    );

    expect(within(drawer).getByText("zip")).toBeInTheDocument();
    const zipLink = within(drawer).getByText("zip").closest("a");
    expect(zipLink).toHaveAttribute("href", dummyUriWithSid);
    expect(zipLink).toHaveAttribute(
      "title",
      "Accéder au texte intégral au format ZIP",
    );

    expect(within(drawer).getByText("xml")).toBeInTheDocument();
    const xmlLink = within(drawer).getByText("xml").closest("a");
    expect(xmlLink).toHaveAttribute("href", dummyUriWithSid);
    expect(xmlLink).toHaveAttribute(
      "title",
      "Accéder aux métadonnées au format XML",
    );

    expect(within(drawer).getByText("json")).toBeInTheDocument();
    const jsonLink = within(drawer).getByText("json").closest("a");
    expect(jsonLink).toHaveAttribute("href", dummyUriWithSid);
    expect(jsonLink).toHaveAttribute(
      "title",
      "Accéder aux métadonnées au format JSON",
    );

    expect(within(drawer).getByText("jpg")).toBeInTheDocument();
    const jpgLink = within(drawer).getByText("jpg").closest("a");
    expect(jpgLink).toHaveAttribute("href", dummyUriWithSid);
    expect(jpgLink).toHaveAttribute(
      "title",
      "Accéder à l'annexe au format JPG",
    );

    expect(within(drawer).getByText("nb")).toBeInTheDocument();
    const nbLink = within(drawer).getByText("nb").closest("a");
    expect(nbLink).toHaveAttribute("href", dummyUriWithSid);
    expect(nbLink).toHaveAttribute(
      "title",
      "Accéder à l'enrichissement Nb au format TEI",
    );

    expect(within(drawer).getByText("teeft")).toBeInTheDocument();
    const teeftLink = within(drawer).getByText("teeft").closest("a");
    expect(teeftLink).toHaveAttribute("href", dummyUriWithSid);
    expect(teeftLink).toHaveAttribute(
      "title",
      "Accéder à l'enrichissement Teeft au format TEI",
    );
  });

  it("doesn't render an external link when the corpus name is not one of corpusWithExternalFulltextLink", async () => {
    await renderDocumentDetail({
      corpusName: "hello",
      doi: ["1234"],
    });

    const externalLink = getExternalLink();

    expect(externalLink).not.toBeInTheDocument();
  });

  it("doesn't render an external link when the corpus name is one of corpusWithExternalFulltextLink but DOI and fulltextUrl are not defined", async () => {
    await renderDocumentDetail({
      corpusName: corpusWithExternalFulltextLink[0],
    });

    const externalLink = getExternalLink();

    expect(externalLink).not.toBeInTheDocument();
  });

  it("renders an external link using the DOI when the corpus name is one of corpusWithExternalFulltextLink and a DOI is present", async () => {
    await renderDocumentDetail({
      corpusName: corpusWithExternalFulltextLink[0],
      doi: ["1234"],
    });

    const externalLink = getExternalLink();

    expect(externalLink).toBeInTheDocument();
    expect(externalLink).toHaveAttribute("href", "https://doi.org/1234");
  });

  it("renders an external link using the fulltextUrl when the corpus name is one of corpusWithExternalFulltextLink but DOI is not defined", async () => {
    await renderDocumentDetail({
      corpusName: corpusWithExternalFulltextLink[0],
      fulltextUrl: "https://example.com/",
    });

    const externalLink = getExternalLink();

    expect(externalLink).toBeInTheDocument();
    expect(externalLink).toHaveAttribute("href", "https://example.com/");
  });

  it("calls handleCloseDocument when the close button is clicked", async () => {
    await renderDocumentDetail();

    const drawer = screen.getByRole("presentation");
    const closeButton = within(drawer).getByText("Revenir aux résultats");
    await userEvent.click(closeButton);
    await waitFor(() => {
      expect(drawer).not.toBeInTheDocument();
    });
  });

  it("toggles the selection when the select button is clicked", async () => {
    await renderDocumentDetail();

    const drawer = screen.getByRole("presentation");
    const selectButton = within(drawer).getByText("Sélectionner");
    const excludeButton = within(drawer).getByText("Exclure");
    await userEvent.click(selectButton);
    expect(selectButton).toHaveTextContent("Désélectionner");
    expect(excludeButton).toBeDisabled();

    await userEvent.click(selectButton);
    expect(selectButton).toHaveTextContent("Sélectionner");
    expect(excludeButton).not.toBeDisabled();
  });

  it("toggles the exclusion when the exclude button is clicked", async () => {
    await renderDocumentDetail();

    const drawer = screen.getByRole("presentation");
    const selectButton = within(drawer).getByText("Sélectionner");
    const excludeButton = within(drawer).getByText("Exclure");
    await userEvent.click(excludeButton);
    expect(excludeButton).toHaveTextContent("Inclure");
    expect(selectButton).toBeDisabled();

    await userEvent.click(excludeButton);
    expect(excludeButton).toHaveTextContent("Exclure");
    expect(selectButton).not.toBeDisabled();
  });
});

const dummyUri = "https://foo.bar/";
const dummyUriWithSid = `${dummyUri}?sid=istex-search`;
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
    { extension: "pdf", uri: dummyUri },
    { extension: "zip", uri: dummyUri },
  ],
  metadata: [
    { extension: "xml", uri: dummyUri },
    { extension: "json", uri: dummyUri },
  ],
  annexes: [{ extension: "jpg", uri: dummyUri }],
  enrichments: {
    nb: [
      {
        extension: "tei",
        uri: dummyUri,
      },
    ],
    teeft: [
      {
        extension: "tei",
        uri: dummyUri,
      },
    ],
  },
};

const results: IstexApiResponse = {
  total: 1,
  firstPageURI: "",
  lastPageURI: "",
  hits: [document],
  aggregations: {},
};

async function renderDocumentDetail(partialDocument: Partial<Result> = {}) {
  const newDocument = { ...document, ...partialDocument };
  render(
    <>
      <ResultCard info={newDocument} />
      <DocumentDetail />
    </>,
    { results: { ...results, hits: [newDocument] } },
  );

  const card = screen.getByText(newDocument.title ?? "").closest("button");
  if (card == null) {
    throw new Error("Couldn't find click area on result card");
  }

  await userEvent.click(card);
}

function getExternalLink() {
  return screen.queryByRole("link", {
    name: "plateforme d'origine",
  });
}
