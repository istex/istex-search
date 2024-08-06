import { customRender as render, screen } from "../test-utils";
import FileButton, {
  type FileButtonProps,
} from "@/app/[locale]/results/components/Document/FileButton";

describe("FileButton", () => {
  const defaultProps: FileButtonProps = {
    category: "fulltext",
    extension: "pdf",
    enrichmentName: null,
    uri: new URL("https://example.com/"),
  };

  it("uses the extension for the aria-label and text content", () => {
    const extension = "pdf";
    render(<FileButton {...defaultProps} extension={extension} />);

    const button = getButton();

    expect(button).toHaveAttribute("aria-label", extension);
    expect(button).toHaveTextContent(extension);
  });

  it("uses the enrichmentName instead of the extension when present for the aria-label and text content", () => {
    const enrichmentName = "nb";
    render(<FileButton {...defaultProps} enrichmentName={enrichmentName} />);

    const button = getButton();

    expect(button).toHaveAttribute("aria-label", enrichmentName);
    expect(button).toHaveTextContent(enrichmentName);
  });

  it("doesn't display the text content when the extension is openAccess", () => {
    const extension = "openAccess";
    render(<FileButton {...defaultProps} extension={extension} />);

    const button = getButton();

    expect(button).not.toHaveTextContent(extension);
  });
});

function getButton() {
  // The component looks like a button but it's actually a link
  return screen.getByRole("link");
}
