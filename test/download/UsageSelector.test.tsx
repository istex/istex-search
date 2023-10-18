import { useRouter } from "next-intl/client";
import {
  mockSearchParams,
  customRender as render,
  screen,
  userEvent,
} from "../test-utils";
import UsageSelector from "@/app/[locale]/results/Download/UsageSelector";
import { usages } from "@/config";
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

    expect(router.replace).toBeCalledWith(expectedUri, { scroll: false });
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
});
