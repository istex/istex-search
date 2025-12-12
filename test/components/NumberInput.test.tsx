import { customRender as render, screen } from "../test-utils";
import NumberInput from "@/components/NumberInput";

describe("NumberInput", () => {
  it("puts the input in an error state when the error prop is true", () => {
    render(<NumberInput error />);

    const input = getInput();

    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("doesn't display the action buttons when the hideActionButtons prop is true", () => {
    render(<NumberInput hideActionButtons />);

    expect(getIncrementButton).toThrow();
    expect(getDecrementButton).toThrow();
  });
});

function getInput() {
  return screen.getByRole("textbox");
}

function getIncrementButton() {
  return screen.getByRole("button", { name: "Augmenter la valeur" });
}

function getDecrementButton() {
  return screen.getByRole("button", { name: "Diminuer la valeur" });
}
