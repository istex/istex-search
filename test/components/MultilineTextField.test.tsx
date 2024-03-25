import {
  customRender as render,
  screen,
  userEvent,
  waitFor,
} from "../test-utils";
import MultilineTextField from "@/components/MultilineTextField";

describe("MultilineTextField", () => {
  it("submits the form on Enter", async () => {
    const mockSubmit = jest.fn();
    render(<MultilineTextField onSubmit={mockSubmit} />);

    const input = screen.getByRole("textbox");
    await waitFor(() => {
      input.focus();
    });
    await userEvent.keyboard("{Enter}");

    expect(mockSubmit).toHaveBeenCalled();
  });

  it("doesn't submit the form on Shift+Enter", async () => {
    const mockSubmit = jest.fn();
    render(<MultilineTextField onSubmit={mockSubmit} />);

    const input = screen.getByRole("textbox");
    await waitFor(() => {
      input.focus();
    });
    await userEvent.keyboard("{Shift>}{Enter}{/Shift}");

    expect(mockSubmit).not.toHaveBeenCalled();
  });
});
