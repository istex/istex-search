import ArchiveSizeWarning from "@/app/[locale]/results/components/Download/ArchiveSizeWarning";
import {
  ARCHIVE_SIZE_THRESHOLD_ERROR,
  ARCHIVE_SIZE_THRESHOLD_WARNING,
} from "@/config";
import { customRender as render, screen } from "../test-utils";

describe("ArchiveSizeWarning", () => {
  it("renders an alert with the warning style when the size is lower than the error threshold", () => {
    render(<ArchiveSizeWarning size={ARCHIVE_SIZE_THRESHOLD_WARNING} />);

    const alert = screen.getByRole("alert");

    expect(alert).toHaveClass("MuiAlert-colorWarning");
  });

  it("renders an alert with the error style when the size is greater than or equal to the error threshold", () => {
    render(<ArchiveSizeWarning size={ARCHIVE_SIZE_THRESHOLD_ERROR} />);

    const alert = screen.getByRole("alert");

    expect(alert).toHaveClass("MuiAlert-colorError");
  });
});
