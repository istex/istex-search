import PerPage from "@/app/[locale]/results/components/PerPage";
import { perPageOptions } from "@/config";
import { customRender as render, screen, userEvent } from "../test-utils";

describe("PerPage", () => {
  it("changes the number of results per page when using the dropdown", async () => {
    const onUrlUpdate = jest.fn();
    render(
      <PerPage fontSize="" labelColor="" selectColor="" />,
      {},
      { onUrlUpdate },
    );

    const dropdown = screen.getByRole("combobox");
    await userEvent.click(dropdown);
    const secondOptionLabel = perPageOptions[1].toString();
    const secondOption = screen.getByRole("option", {
      name: secondOptionLabel,
    });
    await userEvent.click(secondOption);

    expect(onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: `?perPage=${secondOptionLabel}`,
        options: expect.objectContaining({ shallow: false }),
      }),
    );
  });

  it("initializes the dropdown value based on the perPage in the URL", () => {
    const perPage = perPageOptions[1].toString();
    render(
      <PerPage fontSize="" labelColor="" selectColor="" />,
      {},
      { searchParams: { perPage } },
    );

    const dropdown = screen.getByRole("combobox");

    expect(dropdown).toHaveTextContent(perPage);
  });

  it("resets the current page when changing the number of results per page", async () => {
    const onUrlUpdate = jest.fn();
    render(
      <PerPage fontSize="" labelColor="" selectColor="" />,
      {},
      { searchParams: { page: "2" }, onUrlUpdate },
    );

    const dropdown = screen.getByRole("combobox");
    await userEvent.click(dropdown);
    const secondOptionLabel = perPageOptions[1].toString();
    const secondOption = screen.getByRole("option", {
      name: secondOptionLabel,
    });
    await userEvent.click(secondOption);

    // No page search param here
    expect(onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: `?perPage=${secondOptionLabel}`,
        options: expect.objectContaining({ shallow: false }),
      }),
    );
  });
});
