import LocalePicker from "@/app/[locale]/components/Navbar/LocalePicker";
import { useRouter } from "@/i18n/navigation";
import routing from "@/i18n/routing";
import { customRender as render, screen, userEvent } from "../test-utils";

describe("LocalePicker", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays every supported locale", async () => {
    render(<LocalePicker />);

    const button = screen.getByRole("button");
    await userEvent.click(button);

    const menuItems = screen.getAllByRole("menuitem");

    expect(menuItems).toHaveLength(routing.locales.length);
    for (let i = 0; i < routing.locales.length; i++) {
      expect(menuItems[i]).toHaveAttribute("value", routing.locales[i]);
    }
  });

  it("changes the locale when clicking on one of the options", async () => {
    render(<LocalePicker />);

    const router = useRouter();
    const button = screen.getByRole("button");
    await userEvent.click(button);

    const unselectedMenuItem = screen
      .getAllByRole("menuitem")
      .filter((menuItem) => !menuItem.classList.contains("Mui-selected"))[0];
    await userEvent.click(unselectedMenuItem);

    expect(router.push).toHaveBeenCalledWith(expect.anything(), {
      locale: unselectedMenuItem.getAttribute("value"),
    });
  });
});
