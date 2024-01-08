import { customRender as render, screen } from "../test-utils";
import CompatibilityPanelContent from "@/app/[locale]/results/Panel/CompatibilityPanelContent";
import type { Aggregation } from "@/lib/istexApi";

describe("CompatibilityPanelContent", () => {
  const resultsCount = 50;

  const compatibility: Aggregation = {
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
    "enrichments.type": {
      buckets: [
        { key: "multicat", docCount: 20 },
        { key: "teeft", docCount: 18 },
        { key: "unitex", docCount: 7 },
      ],
    },
  };

  beforeEach(() => {
    render(<CompatibilityPanelContent compatibility={compatibility} />, {
      resultsCount,
    });
  });

  it("should render the lodex compatibility progress", () => {
    expect(screen.getByText("lodex (100 %)")).toBeInTheDocument();
    expect(screen.getAllByText("json")).toHaveLength(2);
    expect(screen.getAllByRole("progressbar")[0]).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
    expect(screen.getAllByText("50 doc.")).toHaveLength(2);
  });

  it("should render the gargantext compatibility progress", () => {
    expect(screen.getByText("gargantext (100 %)")).toBeInTheDocument();
    expect(screen.getAllByText("json")).toHaveLength(2);
    expect(screen.getAllByRole("progressbar")[4]).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
    expect(screen.getAllByText("50 doc.")).toHaveLength(2);
  });

  it("should render the cortext compatibility progress", () => {
    expect(screen.getByText("cortext (80 %)")).toBeInTheDocument();

    expect(screen.getByText("tei")).toBeInTheDocument();
    expect(screen.getAllByRole("progressbar")[1]).toHaveAttribute(
      "aria-valuenow",
      "80",
    );
    expect(screen.getByText("40 doc.")).toBeInTheDocument();

    expect(screen.getByText("cleaned")).toBeInTheDocument();
    expect(screen.getAllByRole("progressbar")[2]).toHaveAttribute(
      "aria-valuenow",
      "30",
    );
    expect(screen.getByText("15 doc.")).toBeInTheDocument();

    expect(screen.getByText("teeft")).toBeInTheDocument();
    expect(screen.getAllByRole("progressbar")[3]).toHaveAttribute(
      "aria-valuenow",
      "36",
    );
    expect(screen.getByText("18 doc.")).toBeInTheDocument();
  });
});
