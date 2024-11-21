import { customRender as render, screen } from "../test-utils";
import IndicatorPanelContent from "@/app/[locale]/results/components/Panel/IndicatorPanelContent";
import type { IstexApiResponse } from "@/lib/istexApi";

describe("IndicatorPanelContent", () => {
  const results: IstexApiResponse = {
    total: 500,
    hits: [],
    aggregations: {
      "qualityIndicators.abstractCharCount": {
        buckets: [{ key: "", docCount: 100 }],
      },
      "qualityIndicators.pdfText": {
        buckets: [
          { docCount: 450, keyAsString: "true", key: "" },
          { docCount: 50, keyAsString: "false", key: "" },
        ],
      },
      "qualityIndicators.tdmReady": {
        buckets: [
          { docCount: 150, keyAsString: "true", key: "" },
          { docCount: 350, keyAsString: "false", key: "" },
        ],
      },
      language: {
        buckets: [
          { key: "eng", docCount: 200 },
          { key: "fre", docCount: 180 },
          { key: "ger", docCount: 117 },
          { key: "spa", docCount: 2 },
          { key: "rus", docCount: 1 },
        ],
      },
    },
  };

  beforeEach(() => {
    render(<IndicatorPanelContent />, { results });
  });

  it("renders the summary presence indicator", () => {
    expect(screen.getByText("Résumé")).toBeInTheDocument();
    expect(screen.getByText("20 %")).toBeInTheDocument();
    expect(screen.getByText("100 doc.")).toBeInTheDocument();
  });

  it("renders the PDF presence indicator", () => {
    expect(screen.getByText("PDF texte")).toBeInTheDocument();
    expect(screen.getByText("90 %")).toBeInTheDocument();
    expect(screen.getByText("450 doc.")).toBeInTheDocument();
  });

  it("renders the cleaned text presence indicator", () => {
    expect(screen.getByText("Texte nettoyé")).toBeInTheDocument();
    expect(screen.getByText("30 %")).toBeInTheDocument();
    expect(screen.getByText("150 doc.")).toBeInTheDocument();
  });

  it("renders the language indicator", () => {
    expect(screen.getByText("Langue de publication")).toBeInTheDocument();
    expect(screen.getByText("anglais : 200 doc. (40 %)")).toBeInTheDocument();
    expect(screen.getByText("français : 180 doc. (36 %)")).toBeInTheDocument();
    expect(
      screen.getByText("allemand : 117 doc. (23,4 %)"),
    ).toBeInTheDocument();
    expect(screen.getByText("autres : 3 doc. (0,6 %)")).toBeInTheDocument();
  });
});
