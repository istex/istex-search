import { customRender as render, screen, userEvent } from "../test-utils";
import DownloadButton from "@/app/[locale]/results/components/DownloadButton";

describe("DownloadButton (results page)", () => {
  it("opens the modal when clicking the button", async () => {
    render(<DownloadButton />);

    const button = screen.getByRole("button", {
      name: "Télécharger le corpus (0)",
    });
    await userEvent.click(button);
    const dialog = screen.getByRole("dialog");

    expect(dialog).toBeVisible();
  });
});
