import {
  mockSearchParams,
  customRender as render,
  screen,
  userEvent,
} from "../test-utils";
import UsageSelector from "@/app/[locale]/results/components/Download/UsageSelector";
import { usages } from "@/config";
import { useRouter } from "@/i18n/routing";
import { buildExtractParamsFromFormats } from "@/lib/formats";

describe("UsageSelector", () => {
  it("automatically selects formats when selecting a usage", async () => {
    render(<UsageSelector />);

    const router = useRouter();
    const lodexButton = screen.getByRole("tab", {
      name: "Lodex",
    });
    await userEvent.click(lodexButton);
    const expectedUri = `/?usage=lodex&extract=${encodeURIComponent(
      buildExtractParamsFromFormats(usages.lodex.formats),
    )}`;

    expect(router.replace).toHaveBeenCalledWith(expectedUri, { scroll: false });
  });

  it("initializes the usage based on the usage in the URL", () => {
    mockSearchParams({
      usage: "lodex",
    });
    render(<UsageSelector />);

    const lodexButton = screen.getByRole("tab", {
      name: "Lodex",
    });

    expect(lodexButton).toHaveAttribute("aria-selected", "true");
  });

  it("automatically changes the archive type when the currently selected one isn't supported by the new usage", async () => {
    mockSearchParams({
      archiveType: "tar",
    });
    render(<UsageSelector />);

    const router = useRouter();
    const gargantextButton = screen.getByRole("tab", {
      name: "GarganText",
    });
    await userEvent.click(gargantextButton);

    // No archive type here because GarganText only supports zip, which is the default
    const expectedUri = "/?usage=gargantext&extract=metadata%5Bjson%5D";

    expect(router.replace).toHaveBeenCalledWith(expectedUri, {
      scroll: false,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
});
