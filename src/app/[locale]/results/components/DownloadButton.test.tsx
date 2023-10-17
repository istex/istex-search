import { useRouter } from "next-intl/client";
import DownloadButton from "./DownloadButton";
import ResultsProvider from "@/contexts/ResultsContext";
import { customRender as render, screen, userEvent } from "@/test-utils";

describe("DownloadButton (results page)", () => {
  it("opens the modal when clicking the button", async () => {
    render(
      <ResultsProvider resultsCount={3}>
        <DownloadButton />
      </ResultsProvider>,
    );

    const button = screen.getByRole("button");
    await userEvent.click(button);
    const dialog = screen.getByRole("dialog");

    expect(dialog).toBeVisible();
  });

  it("sets the size to the results count when opening the modal", async () => {
    render(
      <ResultsProvider resultsCount={3}>
        <DownloadButton />
      </ResultsProvider>,
    );

    const router = useRouter();
    const button = screen.getByRole("button");
    await userEvent.click(button);

    // In a real scenario, the pathname should be "/results" but
    // the usePathname mock always returns "/"
    expect(router.replace).toBeCalledWith(`/?size=${3}`, { scroll: false });
  });
});
