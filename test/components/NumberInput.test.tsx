import { customRender as render, screen, userEvent } from "../test-utils";
import NumberInput from "@/components/NumberInput";

describe("NumberInput", () => {
  it("formats the value inside the input", () => {
    const value = 1234.5678;
    render(<NumberInput value={value} />);

    const input = getInput();

    expect(input).toHaveValue("1\u202f234,5678");
  });

  it("calls the onChange prop when it is provided", async () => {
    const value = 2;
    const setValue = jest.fn();
    render(<NumberInput value={value} onChange={setValue} />);

    const input = getInput();
    await userEvent.type(input, "3");

    expect(setValue).toHaveBeenCalledWith(23);
  });

  it("increments the value by the step when clicking on the increment button", async () => {
    const value = 4;
    const step = 2;
    render(<NumberInput value={value} step={step} />);

    const input = getInput();
    const incrementButton = getIncrementButton();
    await userEvent.click(incrementButton);

    expect(input).toHaveValue((value + step).toString());
  });

  it("decrements the value by the step when clicking on the decrement button", async () => {
    const value = 4;
    const step = 2;
    render(<NumberInput value={value} step={step} />);

    const input = getInput();
    const incrementButton = getDecrementButton();
    await userEvent.click(incrementButton);

    expect(input).toHaveValue((value - step).toString());
  });

  it("increments the value by the step when pressing ArrowUp", async () => {
    const value = 4;
    const step = 2;
    render(<NumberInput value={value} step={step} />);

    const input = getInput();
    input.focus();
    await userEvent.keyboard("{ArrowUp}");

    expect(input).toHaveValue((value + step).toString());
  });

  it("decrements the value by the step when pressing ArrowDown", async () => {
    const value = 4;
    const step = 2;
    render(<NumberInput value={value} step={step} />);

    const input = getInput();
    input.focus();
    await userEvent.keyboard("{ArrowDown}");

    expect(input).toHaveValue((value - step).toString());
  });

  it("doesn't increment the value when the value + the step is greater than the max", async () => {
    const value = 4;
    const max = 5;
    const step = 2;
    render(<NumberInput value={value} step={step} max={max} />);

    const input = getInput();
    const incrementButton = getIncrementButton();
    input.focus();
    await userEvent.keyboard("{ArrowUp}");

    expect(input).toHaveValue(value.toString());
    expect(incrementButton).toBeDisabled();
  });

  it("doesn't decrement the value when the value - the step is smaller than the min", async () => {
    const value = 4;
    const min = 3;
    const step = 2;
    render(<NumberInput value={value} step={step} min={min} />);

    const input = getInput();
    const decrementButton = getDecrementButton();
    input.focus();
    await userEvent.keyboard("{ArrowDown}");

    expect(input).toHaveValue(value.toString());
    expect(decrementButton).toBeDisabled();
  });

  it("sets aria labels for the action buttons", () => {
    render(<NumberInput />);

    const incrementButton = getIncrementButton();
    const decrementButton = getDecrementButton();

    expect(incrementButton).toHaveAccessibleName();
    expect(decrementButton).toHaveAccessibleName();
  });

  it("doesn't display the action buttons when the hideActionButtons prop is true", () => {
    render(<NumberInput hideActionButtons />);

    expect(getIncrementButton).toThrow();
    expect(getDecrementButton).toThrow();
  });

  it("disables the input and the action buttons when the disabled prop is true", () => {
    render(<NumberInput disabled />);

    const input = getInput();
    const incrementButton = getIncrementButton();
    const decrementButton = getDecrementButton();

    expect(input).toBeDisabled();
    expect(incrementButton).toBeDisabled();
    expect(decrementButton).toBeDisabled();
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
