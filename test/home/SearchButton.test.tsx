import { customRender as render, screen, userEvent } from "../test-utils";
import SearchButton from "@/app/[locale]/components/SearchSection/SearchButton";

describe("SearchButton", () => {
  it("should render the SearchButton component", () => {
    render(<SearchButton />);

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Rechercher");
    expect(getComputedStyle(screen.getByRole("button")).height).toBe("65px");
    expect(getComputedStyle(screen.getByRole("button")).padding).toBe(
      "15.6px 14px 15.6px 14px",
    );
    expect(
      getComputedStyle(screen.getByRole("button")).borderTopLeftRadius,
    ).toBe("");
    expect(
      getComputedStyle(screen.getByRole("button")).borderBottomLeftRadius,
    ).toBe("");
  });

  it("should render the SearchButton component on alone display mode", () => {
    render(<SearchButton isAlone />);

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Rechercher");
    expect(getComputedStyle(screen.getByRole("button")).height).not.toBe(
      "65px",
    );
    expect(getComputedStyle(screen.getByRole("button")).padding).toBe(
      "16px 40px 16px 40px",
    );
    expect(getComputedStyle(screen.getByRole("button")).borderRadius).toBe(
      "4px",
    );
  });

  it("should render the SearchButton component on loading display mode", () => {
    render(<SearchButton />, { loading: true });

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should call the search function", async () => {
    const handler: React.FormEventHandler = (event) => {
      event.preventDefault();
    };
    const onSubmit = jest.fn(handler);
    render(
      <form onSubmit={onSubmit}>
        <SearchButton />
      </form>,
    );

    await userEvent.click(screen.getByRole("button"));
    expect(onSubmit).toHaveBeenCalled();
  });
});
