import { useRouter } from "next-intl/client";
import { customRender as render, screen, userEvent } from "../test-utils";
import DownloadHelpButton from "@/app/[locale]/results/components/DownloadHelpButton";

describe("DownloadButton (results page)", () => {
  it("opens the modal when clicking the button", async () => {
    render(<DownloadHelpButton />);

    const button = screen.getByRole("button", {
      name: "Télécharger le corpus (0)",
    });
    await userEvent.click(button);
    const dialog = screen.getByRole("dialog");

    expect(dialog).toBeVisible();
  });

  it("sets the size to the results count when opening the modal", async () => {
    render(<DownloadHelpButton />, { resultsCount: 3 });

    const router = useRouter();
    const button = screen.getByRole("button", {
      name: "Télécharger le corpus (3)",
    });
    await userEvent.click(button);

    // In a real scenario, the pathname should be "/results" but
    // the usePathname mock always returns "/"
    expect(router.replace).toBeCalledWith(`/?size=${3}`, { scroll: false });
  });
});
