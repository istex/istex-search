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

  it("shows the line numbers when showLineNumbers is not true", () => {
    render(<MultilineTextField />);

    expect(screen.queryByTestId("line-numbers")).not.toBeInTheDocument();
  });

  it("displays the error lines with bold red text", () => {
    const value = ["id1", "id2", "id3"].join("\n");
    const errorLines = [2, 3];
    render(
      <MultilineTextField
        value={value}
        showLineNumbers
        errorLines={errorLines}
      />,
    );

    const lineNumbers = screen.getByTestId("line-numbers");
    const [firstLineNumber, secondLineNumber, thirdLineNumber] = Array.from(
      lineNumbers.children,
    );
    const redColor = "rgb(211, 67, 21)";
    const bold = "700";

    expect(getComputedStyle(firstLineNumber).fontWeight).toBe("normal");
    expect(getComputedStyle(firstLineNumber).color).toBe("");
    expect(getComputedStyle(secondLineNumber).fontWeight).toBe(bold);
    expect(getComputedStyle(secondLineNumber).color).toBe(redColor);
    expect(getComputedStyle(thirdLineNumber).fontWeight).toBe(bold);
    expect(getComputedStyle(thirdLineNumber).color).toBe(redColor);
  });
});
