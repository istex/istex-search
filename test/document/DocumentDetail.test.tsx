import DocumentDetail from "@/app/[locale]/results/components/Document/DocumentDetail";
import ResultCard from "@/app/[locale]/results/components/ResultCard";
import type { IstexApiResponse } from "@/lib/istexApi";
import {
  customRender as render,
  screen,
  userEvent,
  waitFor,
  within,
} from "../test-utils";

const dummyUri = "https://foo.bar/";
const dummyUriWithSid = `${dummyUri}?sid=istex-search`;
const results: IstexApiResponse = {
  total: 3,
  firstPageURI: "",
  lastPageURI: "",
  hits: ["123", "456", "789"].map((id) => ({
    id,
    title: `Document title ${id}`,
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
  })),
  aggregations: {},
};

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
    expect(within(drawer).getByText("Document title 123")).toBeInTheDocument();
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
      "Accéder aux catégories Inist générées par Nb au format TEI",
    );

    expect(within(drawer).getByText("teeft")).toBeInTheDocument();
    const teeftLink = within(drawer).getByText("teeft").closest("a");
    expect(teeftLink).toHaveAttribute("href", dummyUriWithSid);
    expect(teeftLink).toHaveAttribute(
      "title",
      "Accéder à l'indexation générée par Teeft au format TEI",
    );
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

  it("displays the previous document when clicking on the previous button", async () => {
    await renderDocumentDetail(1);

    const drawer = screen.getByRole("presentation");
    const previousTitle = within(drawer).getByRole("heading", { level: 2 });
    expect(previousTitle).toHaveTextContent(results.hits[1].title ?? "");

    const previousButton = within(drawer).getByRole("button", {
      name: "Aller au document précédent",
    });
    await userEvent.click(previousButton);
    const newTitle = within(drawer).getByRole("heading", { level: 2 });
    expect(newTitle).toHaveTextContent(results.hits[0].title ?? "");
  });

  it("displays the next document when clicking on the next button", async () => {
    await renderDocumentDetail(1);

    const drawer = screen.getByRole("presentation");
    const previousTitle = within(drawer).getByRole("heading", { level: 2 });
    expect(previousTitle).toHaveTextContent(results.hits[1].title ?? "");

    const nextButton = within(drawer).getByRole("button", {
      name: "Aller au document suivant",
    });
    await userEvent.click(nextButton);
    const newTitle = within(drawer).getByRole("heading", { level: 2 });
    expect(newTitle).toHaveTextContent(results.hits[2].title ?? "");
  });

  it("disables the previous button when on the first document of the page", async () => {
    await renderDocumentDetail(0);

    const drawer = screen.getByRole("presentation");
    const previousButton = within(drawer).getByRole("button", {
      name: "Aller au document précédent",
    });
    expect(previousButton).toBeDisabled();
  });

  it("disables the next button when on the last document of the page", async () => {
    await renderDocumentDetail(results.hits.length - 1);

    const drawer = screen.getByRole("presentation");
    const nextButton = within(drawer).getByRole("button", {
      name: "Aller au document suivant",
    });
    expect(nextButton).toBeDisabled();
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

async function renderDocumentDetail(index = 0) {
  render(
    <>
      <ResultCard index={index} />
      <DocumentDetail />
    </>,
    { results },
  );

  const card = screen
    .getByText(results.hits[index].title ?? "")
    .closest("button");
  if (card == null) {
    throw new Error("Couldn't find click area on result card");
  }

  await userEvent.click(card);
}
