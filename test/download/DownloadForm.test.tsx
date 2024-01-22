import { customRender as render, screen } from "../test-utils";
import { type SelectedDocument } from "@/app/[locale]/results/Document/DocumentContext";
import DownloadForm from "@/app/[locale]/results/Download/DownloadForm";

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
    expect(
      screen.getByText("Vos documents sélectionnés manuellement"),
    ).toBeInTheDocument();
  });
});
