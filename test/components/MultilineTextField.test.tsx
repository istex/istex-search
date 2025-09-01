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

  it("shows the line numbers when showLineNumbers is true", () => {
    render(<MultilineTextField showLineNumbers />);

    expect(screen.queryByTestId("line-numbers")).toBeInTheDocument();
  });

  it("doesn't show the line numbers when showLineNumbers is not true", () => {
    render(<MultilineTextField />);

    expect(screen.queryByTestId("line-numbers")).not.toBeInTheDocument();
  });

  it("displays the error lines with bold red text", () => {
    // Explanation of why this is needed:
    // https://github.com/TanStack/virtual/issues/641#issuecomment-2851908893
    Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
      value: 800,
    });

    const value = ["id1", "id2", "id3"].join("\n");
    const errorLines = [2, 3];
    const bold = "700";
    render(
      <MultilineTextField
        value={value}
        showLineNumbers
        errorLines={errorLines}
      />,
    );

    const lineNumbers = screen.getAllByTestId(/^line-number-/);

    const [firstLineNumber, secondLineNumber, thirdLineNumber] =
      Array.from(lineNumbers);

    // It'd be nice to test the color but getComputedStyle doesn't seem to work with CSS variables
    // in jsdom
    expect(firstLineNumber).toHaveStyle({ fontWeight: "normal" });
    expect(secondLineNumber).toHaveStyle({ fontWeight: bold });
    expect(thirdLineNumber).toHaveStyle({ fontWeight: bold });
  });
});
