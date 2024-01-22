import { customRender as render, screen, waitFor } from "../test-utils";
import type { SelectedDocument } from "@/app/[locale]/results/Document/DocumentContext";
import SelectedDocPanel from "@/app/[locale]/results/Download/SelectedDocPanel";

describe("SelectedDocPanel", () => {
  it("should render PanelTitle", () => {
    render(<SelectedDocPanel />);
    expect(screen.getByRole("heading")).toBeInTheDocument();
    expect(screen.getByRole("heading")).toHaveTextContent(
      "Vos documents sélectionnés manuellement",
    );
  });

  it("should not render any document when no documents are selected", () => {
    render(<SelectedDocPanel />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("should render selected documents", () => {
    const mockedSelectedDocuments: SelectedDocument[] = [
      { title: "title1", arkIstex: "123" },
      { title: "title2", arkIstex: "456" },
    ];
    localStorage.setItem(
      "selectedDocuments",
      JSON.stringify(mockedSelectedDocuments),
    );
    render(<SelectedDocPanel />);
    expect(screen.getByText("title1")).toBeInTheDocument();
    expect(screen.getByText("title2")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("should call toggleSelectedDocument when the cancel button is clicked", async () => {
    const mockedSelectedDocuments: SelectedDocument[] = [
      { title: "title1", arkIstex: "123" },
      { title: "title2", arkIstex: "456" },
    ];
    localStorage.setItem(
      "selectedDocuments",
      JSON.stringify(mockedSelectedDocuments),
    );
    render(<SelectedDocPanel />);
    const docTitle = screen.getByText("title1");
    expect(docTitle).toBeInTheDocument();
    const unselectButton = screen.getAllByRole("button")[0];
    unselectButton.click();
    await waitFor(() => {
      expect(docTitle).not.toBeInTheDocument();
    });
  });
});
