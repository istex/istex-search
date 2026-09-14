import UsageSelector from "@/app/[locale]/results/components/Download/UsageSelector";
import { customRender as render, screen, userEvent } from "../test-utils";

describe("UsageSelector", () => {
  it("automatically selects formats when selecting a usage", async () => {
    const onUrlUpdate = jest.fn();
    render(<UsageSelector />, {}, { onUrlUpdate });

    const lodexButton = screen.getByRole("tab", {
      name: "Lodex",
    });
    await userEvent.click(lodexButton);

    expect(onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: "?usage=lodex&extract=metadata[json]",
      }),
    );
  });

  it("initializes the usage based on the usage in the URL", () => {
    render(<UsageSelector />, {}, { searchParams: { usage: "lodex" } });

    const lodexButton = screen.getByRole("tab", {
      name: "Lodex",
    });

    expect(lodexButton).toHaveAttribute("aria-selected", "true");
  });

  it("automatically changes the archive type when the currently selected one isn't supported by the new usage", async () => {
    const onUrlUpdate = jest.fn();
    render(
      <UsageSelector />,
      {},
      { searchParams: { archiveType: "tar" }, onUrlUpdate },
    );

    const gargantextButton = screen.getByRole("tab", {
      name: "GarganText",
    });
    await userEvent.click(gargantextButton);

    expect(onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        // No archive type here because GarganText only supports zip, which is the default.
        queryString: "?usage=gargantext&extract=metadata[json]",
      }),
    );
  });
});
