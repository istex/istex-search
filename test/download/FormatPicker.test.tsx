import FormatPicker from "@/app/[locale]/results/components/Download/FormatPicker";
import { customRender as render, screen, userEvent } from "../test-utils";

describe("FormatPicker", () => {
  it("selects all formats from a category when clicking the category checkbox", async () => {
    render(<FormatPicker />);

    const jsonCheckbox = getCheckbox("JSON");
    const modsCheckbox = getCheckbox("MODS");
    const xmlCheckbox = getCheckbox("XML");
    const metadataCheckbox = getCheckbox("Métadonnées");
    await userEvent.click(metadataCheckbox);

    expect(jsonCheckbox).toBeChecked();
    expect(modsCheckbox).toBeChecked();
    expect(xmlCheckbox).toBeChecked();
    expect(metadataCheckbox).toBeChecked();
  });

  it("sets the category checkbox to indeterminate when selecting a format", () => {
    render(
      <FormatPicker />,
      {},
      { searchParams: { extract: "metadata[json]" } },
    );

    const jsonCheckbox = getCheckbox("JSON");
    const metadataCheckbox = getCheckbox("Métadonnées");

    expect(jsonCheckbox).toBeChecked();
    expect(metadataCheckbox).toHaveAttribute("data-indeterminate", "true");
  });

  it("checks the category checkbox when all formats from the category are selected", () => {
    render(
      <FormatPicker />,
      {},
      {
        searchParams: {
          extract: "metadata[json,xml,mods]",
        },
      },
    );

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
