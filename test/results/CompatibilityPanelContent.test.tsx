import { customRender as render, screen, within } from "../test-utils";
import CompatibilityPanelContent from "@/app/[locale]/results/components/Panel/CompatibilityPanelContent";
import type { IstexApiResponse } from "@/lib/istexApi";

describe("CompatibilityPanelContent", () => {
  const results: IstexApiResponse = {
    total: 50,
    hits: [],
    aggregations: {
      "qualityIndicators.teiSource": {
        buckets: [
          { key: "pub2tei", docCount: 30 },
          { key: "grobid", docCount: 10 },
        ],
      },
      "qualityIndicators.tdmReady": {
        buckets: [
          { docCount: 15, keyAsString: "true", key: "" },
          { docCount: 35, keyAsString: "false", key: "" },
        ],
      },
      "qualityIndicators.pdfText": {
        buckets: [
          { docCount: 25, keyAsString: "true", key: 1 },
          { docCount: 15, keyAsString: "false", key: 0 },
        ],
      },
      "enrichments.type": {
        buckets: [
          { key: "multicat", docCount: 20 },
          { key: "teeft", docCount: 18 },
          { key: "unitex", docCount: 7 },
        ],
      },
    },
  };

  beforeEach(() => {
    render(<CompatibilityPanelContent />, {
      results,
    });
  });

  it("renders the lodex compatibility progress", () => {
    const compatibilityGroup = screen.getByTestId("lodex-compatibility");
    const title = within(compatibilityGroup).queryByText("lodex (100 %)");
    const jsonLabel = within(compatibilityGroup).queryByText("json");
    const progressBars = within(compatibilityGroup).getAllByRole("progressbar");
    const jsonDocCount = within(compatibilityGroup).queryByText(
      `${results.total} doc.`,
    );

    expect(title).toBeInTheDocument();
    expect(jsonLabel).toBeInTheDocument();
    expect(progressBars).toHaveLength(1);
    expect(progressBars[0]).toHaveAttribute("aria-valuenow", "100");
    expect(jsonDocCount).toBeInTheDocument();
  });

  it("renders the gargantext compatibility progress", () => {
    const compatibilityGroup = screen.getByTestId("gargantext-compatibility");
    const title = within(compatibilityGroup).queryByText("gargantext (100 %)");
    const jsonLabel = within(compatibilityGroup).queryByText("json");
    const progressBars = within(compatibilityGroup).getAllByRole("progressbar");
    const jsonDocCount = within(compatibilityGroup).queryByText(
      `${results.total} doc.`,
    );

    expect(title).toBeInTheDocument();
    expect(jsonLabel).toBeInTheDocument();
    expect(progressBars).toHaveLength(1);
    expect(progressBars[0]).toHaveAttribute("aria-valuenow", "100");
    expect(jsonDocCount).toBeInTheDocument();
  });

  it("renders the cortext compatibility progress", () => {
    const compatibilityGroup = screen.getByTestId("cortext-compatibility");
    const title = within(compatibilityGroup).queryByText("cortext (80 %)");
    const teiLabel = within(compatibilityGroup).queryByText("tei");
    const cleanedLabel = within(compatibilityGroup).queryByText("cleaned");
    const teeftLabel = within(compatibilityGroup).queryByText("teeft");
    const progressBars = within(compatibilityGroup).getAllByRole("progressbar");
    const teiDocCount = within(compatibilityGroup).queryByText("40 doc.");
    const cleanedDocCount = within(compatibilityGroup).queryByText("15 doc.");
    const teeftDocCount = within(compatibilityGroup).queryByText("18 doc.");

    expect(title).toBeInTheDocument();
    expect(teiLabel).toBeInTheDocument();
    expect(cleanedLabel).toBeInTheDocument();
    expect(teeftLabel).toBeInTheDocument();
    expect(progressBars).toHaveLength(3);
    expect(progressBars[0]).toHaveAttribute("aria-valuenow", "80");
    expect(progressBars[1]).toHaveAttribute("aria-valuenow", "30");
    expect(progressBars[2]).toHaveAttribute("aria-valuenow", "36");
    expect(teiDocCount).toBeInTheDocument();
    expect(cleanedDocCount).toBeInTheDocument();
    expect(teeftDocCount).toBeInTheDocument();
  });

  it("renders the nooj compatibility progress", () => {
    const compatibilityGroup = screen.getByTestId("nooj-compatibility");
    const title = within(compatibilityGroup).queryByText("nooj (100 %)");
    const cleanedLabel = within(compatibilityGroup).queryByText("cleaned");
    const modsLabel = within(compatibilityGroup).queryByText("mods");
    const txtLabel = within(compatibilityGroup).queryByText("txt");
    const progressBars = within(compatibilityGroup).getAllByRole("progressbar");
    const cleanedDocCount = within(compatibilityGroup).queryByText("15 doc.");
    const modsDocCount = within(compatibilityGroup).queryByText(
      `${results.total} doc.`,
    );
    const txtDocCount = within(compatibilityGroup).queryByText("25 doc.");

    expect(title).toBeInTheDocument();
    expect(modsLabel).toBeInTheDocument();
    expect(cleanedLabel).toBeInTheDocument();
    expect(txtLabel).toBeInTheDocument();
    expect(progressBars).toHaveLength(3);
    expect(progressBars[0]).toHaveAttribute("aria-valuenow", "30");
    expect(progressBars[1]).toHaveAttribute("aria-valuenow", "100");
    expect(progressBars[2]).toHaveAttribute("aria-valuenow", "50");
    expect(modsDocCount).toBeInTheDocument();
    expect(cleanedDocCount).toBeInTheDocument();
    expect(txtDocCount).toBeInTheDocument();
  });
});
