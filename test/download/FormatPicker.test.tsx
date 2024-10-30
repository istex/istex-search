import {
  mockSearchParams,
  customRender as render,
  screen,
  userEvent,
} from "../test-utils";
import FormatPicker from "@/app/[locale]/results/components/Download/FormatPicker";
import { formats } from "@/config";
import { useRouter } from "@/i18n/routing";
import { buildExtractParamsFromFormats } from "@/lib/formats";

describe("FormatPicker", () => {
  it("inserts the extract params in the URL when selecting a format", async () => {
    await testFormatSelection("JSON", formats.metadata.json);
  });

  it("selects all formats from a category when clicking the category checkbox", async () => {
    await testFormatSelection(
      "Métadonnées",
      formats.metadata.json | formats.metadata.xml | formats.metadata.mods,
    );
  });

  it("sets the category checkbox to indeterminate when selecting a format", () => {
    mockSearchParams({
      extract: "metadata[json]",
    });
    render(<FormatPicker />);

    const jsonCheckbox = getCheckbox("JSON");
    const metadataCheckbox = getCheckbox("Métadonnées");

    expect(jsonCheckbox).toBeChecked();
    expect(metadataCheckbox).toHaveAttribute("data-indeterminate", "true");
  });

  it("checks the category checkbox when all formats from the category are selected", () => {
    mockSearchParams({
      extract: "metadata[json,xml,mods]",
    });
    render(<FormatPicker />);

    const jsonCheckbox = getCheckbox("JSON");
    const xmlCheckbox = getCheckbox("XML");
    const modsCheckbox = getCheckbox("MODS");
    const metadataCheckbox = getCheckbox("Métadonnées");

    expect(jsonCheckbox).toBeChecked();
    expect(xmlCheckbox).toBeChecked();
    expect(modsCheckbox).toBeChecked();
    expect(metadataCheckbox).toBeChecked();
    expect(metadataCheckbox).toHaveAttribute("data-indeterminate", "false");
  });
});

function getCheckbox(name: string) {
  return screen.getByRole("checkbox", { name });
}

async function testFormatSelection(
  checkboxName: string,
  expectedFormats: number,
) {
  render(<FormatPicker />);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  const jsonCheckbox = getCheckbox(checkboxName);
  await userEvent.click(jsonCheckbox);
  const expectedUri = `/?extract=${encodeURIComponent(
    buildExtractParamsFromFormats(expectedFormats),
  )}`;

  expect(router.replace).toHaveBeenCalledWith(expectedUri, { scroll: false });
}
