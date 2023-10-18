import { customRender as render, screen, userEvent } from "../test-utils";
import DownloadModal from "@/app/[locale]/results/Download/DownloadModal";

describe("DownloadModal", () => {
  it("doesn't open the modal when open is set to false", () => {
    render(
      <DownloadModal open={false} onClose={jest.fn()}>
        <div />
      </DownloadModal>,
    );

    const dialog = screen.queryByRole("dialog");

    expect(dialog).toBeNull();
  });

  it("closes the modal when clicking on the cross", async () => {
    const onClose = jest.fn();
    render(
      <DownloadModal open onClose={onClose}>
        <div />
      </DownloadModal>,
    );

    const cross = screen.getByTestId("close-modal-button");
    await userEvent.click(cross);

    expect(onClose).toBeCalled();
  });
});
