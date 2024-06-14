import {
  mockSearchParams,
  customRender as render,
  userEvent,
} from "../test-utils";
import ArchiveSettings from "@/app/[locale]/results/components/Download/ArchiveSettings";
import { useRouter } from "@/i18n/navigation";

describe("ArchiveSettings", () => {
  it("changes the archive type in the URL when changing the select value", async () => {
    mockSearchParams({});
    const { container } = render(<ArchiveSettings />);

    const router = useRouter();
    const select = getArchiveTypeSelect(container);
    await userEvent.click(select);
    await userEvent.keyboard("{ArrowDown}{Enter}");

    expect(router.replace).toHaveBeenCalledWith("/?archiveType=tar", {
      scroll: false,
    });
  });

  it("initializes the select value based on the archive type in the URL", () => {
    mockSearchParams({
      archiveType: "tar",
    });
    const { container } = render(<ArchiveSettings />);

    const select = getArchiveTypeSelect(container);

    expect(select).toHaveTextContent("TAR.GZ");
  });

  it("changes the compression level in the URL when changing the select value", async () => {
    mockSearchParams({});
    const { container } = render(<ArchiveSettings />);

    const router = useRouter();
    const select = getCompressionLevelSelect(container);
    await userEvent.click(select);
    await userEvent.keyboard("{ArrowDown}{Enter}");

    expect(router.replace).toHaveBeenCalledWith("/?compressionLevel=9", {
      scroll: false,
    });
  });

  it("initializes the select value based on the archive type in the URL", () => {
    mockSearchParams({
      compressionLevel: "9",
    });
    const { container } = render(<ArchiveSettings />);

    const select = getCompressionLevelSelect(container);

    expect(select).toHaveTextContent("élevée");
  });

  beforeEach(() => {
    jest.clearAllMocks();
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
