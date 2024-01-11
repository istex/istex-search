import { fireEvent, customRender as render, screen } from "../test-utils";
import FacetCheckboxItem from "@/app/[locale]/results/facets/FacetCheckboxItem";

describe("FacetCheckboxItem", () => {
  const value = "Option 1";
  const count = 10;
  let checked = false;

  it("should render the checkbox item correctly", () => {
    render(
      <FacetCheckboxItem
        value={value}
        count={count}
        checked={checked}
        excluded={false}
        onChange={() => {}}
      />,
    );
    const checkbox = screen.getByRole("checkbox");
    const label = screen.getByText(value);
    const countText = screen.getByText(count.toLocaleString());

    expect(checkbox).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(countText).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
    expect(label).toHaveStyle("font-weight: 400");
  });

  it("should call onChange when checkbox is clicked", () => {
    const onChange = jest.fn();
    render(
      <FacetCheckboxItem
        value={value}
        count={count}
        checked={checked}
        excluded={false}
        onChange={onChange}
      />,
    );

    const checkbox = screen.getByRole("checkbox");

    fireEvent.click(checkbox);

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("should update checkbox state and label style when checked prop is true", () => {
    checked = true;
    render(
      <FacetCheckboxItem
        value={value}
        count={count}
        checked={checked}
        excluded={false}
        onChange={() => {}}
      />,
    );

    const checkbox = screen.getByRole("checkbox");
    const label = screen.getByText(value);

    expect(checkbox).toBeChecked();
    expect(label).toHaveStyle("font-weight: 700");
  });
});
