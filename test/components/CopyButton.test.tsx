import {
  mockIsSecureContext,
  customRender as render,
  restoreIsSecureContext,
  screen,
  userEvent,
} from "../test-utils";
import CopyButton from "@/components/CopyButton";

describe("CopyButton", () => {
  it("shows a success message when navigator.clipboard.writeText() succeeds", async () => {
    const textToCopy = "awesome text";
    renderCopyButton(textToCopy);

    const button = screen.getByRole("button");
    await userEvent.click(button);

    const clipboardContent = await navigator.clipboard.readText();
    const snackbar = screen.getByRole("alert");

    expect(clipboardContent).toBe(textToCopy);
    expect(snackbar).toHaveClass("MuiAlert-colorSuccess");
  });

  it("shows an error message when navigator.clipboard.writeText() fails", async () => {
    const clipboardSpy = jest.spyOn(navigator.clipboard, "writeText");
    clipboardSpy.mockImplementationOnce(() => Promise.reject(new Error()));

    renderCopyButton();

    const button = screen.getByRole("button");
    await userEvent.click(button);

    const clipboardContent = await navigator.clipboard.readText();
    const snackbar = screen.getByRole("alert");

    expect(clipboardContent).toBe("");
    expect(snackbar).toHaveClass("MuiAlert-colorError");

    clipboardSpy.mockRestore();
  });

  it("shows a warning message when running in an insecure context", async () => {
    renderCopyButton();

    mockIsSecureContext(false);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    restoreIsSecureContext();

    const clipboardContent = await navigator.clipboard.readText();
    const snackbar = screen.getByRole("alert");

    expect(clipboardContent).toBe("");
    expect(snackbar).toHaveClass("MuiAlert-colorWarning");
  });

  beforeEach(() => {
    mockIsSecureContext(true);
  });

  afterEach(() => {
    restoreIsSecureContext();
  });
});

function renderCopyButton(textToCopy?: string) {
  render(
    <CopyButton
      aria-label="copy"
      clipboardText={textToCopy ?? "text"}
      successLabel="success"
    />,
  );
}
