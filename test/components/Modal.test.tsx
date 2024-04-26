import { customRender as render, screen, userEvent } from "../test-utils";
import Modal from "@/components/Modal";

describe("Modal", () => {
  it("renders the title in a heading tag", () => {
    const title = "My super title";
    render(
      <Modal title={title} open onClose={() => {}}>
        <div />
      </Modal>,
    );

    expect(screen.getByRole("heading")).toHaveTextContent(title);
  });

  it("doesn't open the modal when open is set to false", () => {
    const dialog = screen.queryByRole("dialog");

    expect(dialog).toBeNull();
  });

  it("closes the modal when clicking on the cross", async () => {
    const onClose = jest.fn();
    render(
      <Modal title="" open onClose={onClose}>
        <div />
      </Modal>,
    );

    const cross = screen.getByTestId("close-modal-button");
    await userEvent.click(cross);

    expect(onClose).toHaveBeenCalled();
  });
});
