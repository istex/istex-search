import FileButton, {
  type FileButtonProps,
} from "@/app/[locale]/results/components/Document/FileButton";
import { customRender as render, screen } from "../test-utils";

describe("FileButton", () => {
  const defaultProps: FileButtonProps = {
    category: "fulltext",
    extension: "pdf",
    uri: new URL("https://example.com/"),
  };

  it("uses the extension for the text content", () => {
    const extension = "pdf";
    render(<FileButton {...defaultProps} extension={extension} />);

    const button = getButton();

    expect(button).toHaveTextContent(extension);
  });

  it("uses the labelOverride instead of the extension when present for the text content", () => {
    const enrichmentName = "nb";
    render(<FileButton {...defaultProps} labelOverride={enrichmentName} />);

    const button = getButton();

    expect(button).toHaveTextContent(enrichmentName);
  });
});

function getButton() {
  // The component looks like a button but it's actually a link
  return screen.getByRole("link");
}
