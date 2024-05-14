import { customRender as render, screen, userEvent } from "../test-utils";
import DownloadButton from "@/app/[locale]/results/components/DownloadButton";
import { useRouter } from "@/i18n/navigation";

describe("DownloadButton (results page)", () => {
  it("opens the modal when clicking the button", async () => {
    render(<DownloadButton />);

    const button = screen.getByRole("button", {
      name: "Télécharger le corpus (0)",
    });
    await userEvent.click(button);
    const dialog = screen.getByRole("dialog");

    expect(dialog).toBeVisible();
  });

  it("sets the size to the results count when opening the modal", async () => {
    render(<DownloadButton />, { resultsCount: 3 });

    const router = useRouter();
    const button = screen.getByRole("button", {
      name: "Télécharger le corpus (3)",
    });
    await userEvent.click(button);

    // In a real scenario, the pathname should be "/results" but
    // the usePathname mock always returns "/"
    expect(router.replace).toHaveBeenCalledWith("/?size=3", {
      scroll: false,
    });
  });
});
