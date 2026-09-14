import ArchiveSettings from "@/app/[locale]/results/components/Download/ArchiveSettings";
import { customRender as render, userEvent } from "../test-utils";

describe("ArchiveSettings", () => {
  it("changes the archive type in the URL when changing the select value", async () => {
    const onUrlUpdate = jest.fn();
    const { container } = render(<ArchiveSettings />, {}, { onUrlUpdate });

    const select = getArchiveTypeSelect(container);
    await userEvent.click(select);
    await userEvent.keyboard("{ArrowDown}{Enter}");

    expect(onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: "?archiveType=tar",
      }),
    );
  });

  it("initializes the select value based on the archive type in the URL", () => {
    const { container } = render(
      <ArchiveSettings />,
      {},
      { searchParams: { archiveType: "tar" } },
    );

    const select = getArchiveTypeSelect(container);

    expect(select).toHaveTextContent("TAR.GZ");
  });

  it("changes the compression level in the URL when changing the select value", async () => {
    const onUrlUpdate = jest.fn();
    const { container } = render(<ArchiveSettings />, {}, { onUrlUpdate });

    const select = getCompressionLevelSelect(container);
    await userEvent.click(select);
    await userEvent.keyboard("{ArrowDown}{Enter}");

    expect(onUrlUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        queryString: "?compressionLevel=9",
      }),
    );
  });

  it("initializes the select value based on the compression level in the URL", () => {
    const { container } = render(
      <ArchiveSettings />,
      {},
      { searchParams: { compressionLevel: "9" } },
    );

    const select = getCompressionLevelSelect(container);

    expect(select).toHaveTextContent("élevée");
  });

  it("disables the archive type select when only one option is available", () => {
    const { container } = render(
      <ArchiveSettings />,
      {},
      { searchParams: { usage: "cortext" } },
    );

    const select = getArchiveTypeSelect(container);

    expect(select).toHaveAttribute("aria-disabled", "true");
  });
});

function getArchiveTypeSelect(container: HTMLElement) {
  const select = container.querySelector("#archive-type-select");
  if (select == null) {
    throw new Error("Couldn't find archive type select");
  }

  return select;
}

function getCompressionLevelSelect(container: HTMLElement) {
  const select = container.querySelector("#compression-level-select");
  if (select == null) {
    throw new Error("Couldn't find compression level select");
  }

  return select;
}
