import { customRender as render, screen } from "../test-utils";
import IndicatorPanelContent from "@/app/[locale]/results/Panel/IndicatorPanelContent";
import type { Aggregation } from "@/lib/istexApi";

describe("IndicatorPanelContent", () => {
  const indicators: Aggregation = {
    "qualityIndicators.abstractCharCount": {
      buckets: [{ key: "", docCount: 10 }],
    },
    "qualityIndicators.pdfText": {
      buckets: [
        { docCount: 45, keyAsString: "true", key: "" },
        { docCount: 5, keyAsString: "false", key: "" },
      ],
    },
    "qualityIndicators.tdmReady": {
      buckets: [
        { docCount: 15, keyAsString: "true", key: "" },
        { docCount: 35, keyAsString: "false", key: "" },
      ],
    },
    language: {
      buckets: [
        { key: "eng", docCount: 20 },
        { key: "fre", docCount: 18 },
        { key: "ger", docCount: 7 },
      ],
      sumOtherDocCount: 5,
    },
  };

  const resultsCount = 50;

  beforeEach(() => {
    render(<IndicatorPanelContent indicators={indicators} />, { resultsCount });
  });

  it("should render the summary presence indicator", () => {
    expect(screen.getByText("Présence de résumé")).toBeInTheDocument();
    expect(screen.getByText("20 %")).toBeInTheDocument();
    expect(screen.getByText("10 docs")).toBeInTheDocument();
  });

  it("should render the PDF presence indicator", () => {
    expect(screen.getByText("Présence de PDF texte")).toBeInTheDocument();
    expect(screen.getByText("90 %")).toBeInTheDocument();
    expect(screen.getByText("45 docs")).toBeInTheDocument();
  });

  it("should render the cleaned text presence indicator", () => {
    expect(screen.getByText("Présence de texte nettoyé")).toBeInTheDocument();
    expect(screen.getByText("30 %")).toBeInTheDocument();
    expect(screen.getByText("15 docs")).toBeInTheDocument();
  });

  it("should render the language indicator", () => {
    expect(screen.getByText("Langue de publication")).toBeInTheDocument();
    expect(screen.getByText("eng : 20 docs (40 %)")).toBeInTheDocument();
    expect(screen.getByText("fre : 18 docs (36 %)")).toBeInTheDocument();
    expect(screen.getByText("ger : 7 docs (14 %)")).toBeInTheDocument();
    expect(screen.getByText("other : 5 docs (10 %)")).toBeInTheDocument();
  });
});
