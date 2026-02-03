import DownloadForm from "@/app/[locale]/results/components/Download/DownloadForm";
import {
  resetSelectedExcludedDocuments,
  type SelectedDocument,
} from "@/contexts/DocumentContext";
import type { IstexApiResponse } from "@/lib/istexApi";
import {
  mockSearchParams,
  customRender as render,
  screen,
  userEvent,
} from "../test-utils";

describe("DownloadForm", () => {
  it("doesn't render SelectedDocPanel when no documents are selected", () => {
    const mockedSelectedDocuments: SelectedDocument[] = [];
    localStorage.setItem(
      "selectedDocuments",
      JSON.stringify(mockedSelectedDocuments),
    );
    render(
      <DownloadForm closeModal={jest.fn()} openWaitingModal={jest.fn()} />,
    );
    expect(
      screen.queryByText("Vos documents sélectionnés manuellement"),
    ).not.toBeInTheDocument();
  });

  it("renders SelectedDocPanel when documents are selected", () => {
    const mockedSelectedDocuments: SelectedDocument[] = [
      { title: "title", arkIstex: "arkIstex" },
    ];
    localStorage.setItem(
      "selectedDocuments",
      JSON.stringify(mockedSelectedDocuments),
    );
    render(
      <DownloadForm closeModal={jest.fn()} openWaitingModal={jest.fn()} />,
    );
    expect(screen.getByText("Documents sélectionnés")).toBeInTheDocument();
  });

  it("sets the current size to the max size if the max size becomes smaller than the current size", async () => {
    const mockedSelectedDocuments: SelectedDocument[] = [
      { title: "title1", arkIstex: "arkIstex1" },
      { title: "title2", arkIstex: "arkIstex2" },
    ];
    localStorage.setItem(
      "selectedDocuments",
      JSON.stringify(mockedSelectedDocuments),
    );
    render(
      <DownloadForm closeModal={jest.fn()} openWaitingModal={jest.fn()} />,
      { results: generateResults(10000) },
    );

    const sizeInput = screen.getByRole("textbox");
    const firstSelectedDocumentRemoveButton = screen.getAllByRole("button", {
      name: "Désélectionner",
    })[0];

    expect(sizeInput).toHaveValue(mockedSelectedDocuments.length.toString());

    await userEvent.click(firstSelectedDocumentRemoveButton);

    expect(sizeInput).toHaveValue(
      (mockedSelectedDocuments.length - 1).toString(),
    );
  });

  it("renders an alert when the estimated archive size is greater than 1GB", () => {
    mockSearchParams({
      extract: "fulltext[pdf]",
    });
    render(
      <DownloadForm closeModal={jest.fn()} openWaitingModal={jest.fn()} />,
      { results: generateResults(10000) },
    );

    const alert = screen.getByRole("alert");

    expect(alert).toBeInTheDocument();
  });

  it("doesn't render any alert when the estimated archive size is less than 1GB", () => {
    mockSearchParams({
      extract: "fulltext[pdf]",
    });
    render(
      <DownloadForm closeModal={jest.fn()} openWaitingModal={jest.fn()} />,
      { results: generateResults(3) },
    );

    const alert = screen.queryByRole("alert");

    expect(alert).not.toBeInTheDocument();
  });

  afterEach(() => {
    resetSelectedExcludedDocuments();
  });
});

function generateResults(resultCount: number): IstexApiResponse {
  return {
    total: resultCount,
    hits: [],
    aggregations: {},
  };
}
