import {
  mockSearchParams,
  customRender as render,
  screen,
  userEvent,
} from "../test-utils";
import PerPage from "@/app/[locale]/results/components/PerPage";
import { perPageOptions } from "@/config";
import { useRouter } from "@/i18n/navigation";

describe("PerPage", () => {
  it("changes the number of results per page when using the dropdown", async () => {
    const router = useRouter();
    render(<PerPage fontSize="" labelColor="" selectColor="" />);

    const dropdown = screen.getByRole("combobox");
    await userEvent.click(dropdown);
    const secondOptionLabel = perPageOptions[1].toString();
    const secondOption = screen.getByRole("option", {
      name: secondOptionLabel,
    });
    await userEvent.click(secondOption);

    expect(router.replace).toBeCalledWith(`/?perPage=${secondOptionLabel}`, {
      scroll: false,
    });
  });

  it("initializes the dropdown value based on the perPage in the URL", () => {
    const perPage = perPageOptions[1].toString();
    mockSearchParams({
      perPage,
    });
    render(<PerPage fontSize="" labelColor="" selectColor="" />);

    const dropdown = screen.getByRole("combobox");

    expect(dropdown).toHaveTextContent(perPage);
  });
});
