import SearchButton from "@/app/[locale]/components/SearchSection/SearchButton";
import { customRender as render, screen, userEvent } from "../test-utils";

describe("SearchButton", () => {
  it("enables the button when loading is set to false", () => {
    render(<SearchButton />, { loading: false });

    const button = screen.getByRole("button");

    expect(button).toBeEnabled();
  });

  it("disables the button when loading is set to true", () => {
    render(<SearchButton />, { loading: true });

    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
  });

  it("calls the form onSubmit handler when clicking on the button", async () => {
    const onSubmit = jest.fn((e: React.SubmitEvent) => {
      e.preventDefault();
    });
    render(
      <form onSubmit={onSubmit}>
        <SearchButton />
      </form>,
    );

    const button = screen.getByRole("button");
    await userEvent.click(button);

    expect(onSubmit).toHaveBeenCalled();
  });
});
