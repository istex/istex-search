import { customRender as render, screen } from "../test-utils";
import DownloadForm from "@/app/[locale]/results/Download/DownloadForm";
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
});
