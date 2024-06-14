import {
  mockSearchParams,
  customRender as render,
  screen,
} from "../test-utils";
import DownloadForm from "@/app/[locale]/results/components/Download/DownloadForm";
import type { SelectedDocument } from "@/contexts/DocumentContext";

describe("DownloadForm", () => {
  it("should not render SelectedDocPanel when no documents are selected", () => {
    const mockedSelectedDocuments: SelectedDocument[] = [];
    localStorage.setItem(
      "selectedDocuments",
      JSON.stringify(mockedSelectedDocuments),
    );
    render(<DownloadForm />);
    expect(
      screen.queryByText("Vos documents sélectionnés manuellement"),
    ).not.toBeInTheDocument();
  });

  it("should render SelectedDocPanel when documents are selected", () => {
    const mockedSelectedDocuments: SelectedDocument[] = [
      { title: "title", arkIstex: "arkIstex" },
    ];
    localStorage.setItem(
      "selectedDocuments",
      JSON.stringify(mockedSelectedDocuments),
    );
    render(<DownloadForm />);
    expect(screen.getByText("Documents sélectionnés")).toBeInTheDocument();
  });

  it("renders an alert when the estimated archive size is greater than 1GB", () => {
    mockSearchParams({
      extract: "fulltext[pdf]",
      size: "10000",
    });
    render(<DownloadForm />);

    const alert = screen.getByRole("alert");

    expect(alert).toBeInTheDocument();
  });

  it("doesn't render any alert when the estimated archive size is less than 1GB", () => {
    mockSearchParams({
      extract: "fulltext[pdf]",
      size: "3",
    });
    render(<DownloadForm />);

    const alert = screen.queryByRole("alert");

    expect(alert).not.toBeInTheDocument();
  });
});
