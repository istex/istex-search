import LocalePicker from "@/app/[locale]/components/Navbar/LocalePicker";
import { routing, useRouter } from "@/i18n/routing";
import { customRender as render, screen, userEvent } from "../test-utils";

describe("LocalePicker", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays every supported locale", async () => {
    render(<LocalePicker />);

    const select = screen.getByRole("combobox");
    await userEvent.click(select);

    const options = screen.getAllByRole("option");

    expect(options).toHaveLength(routing.locales.length);
    for (let i = 0; i < routing.locales.length; i++) {
      expect(options[i]).toHaveAttribute("data-value", routing.locales[i]);
    }
  });

  it("changes the locale when clicking on one of the options", async () => {
    render(<LocalePicker />);

    const router = useRouter();
    const select = screen.getByRole("combobox");
    await userEvent.click(select);

    const unselectedOption = screen.getAllByRole("option", {
      selected: false,
    })[0];
    await userEvent.click(unselectedOption);

    expect(router.push).toHaveBeenCalledWith(expect.anything(), {
      locale: unselectedOption.getAttribute("data-value"),
    });
  });
});
