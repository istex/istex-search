"use client";

import { Box } from "@mui/material";
import CompatibilityProgress from "./CompatibilityProgress";
import { useQueryContext } from "@/contexts/QueryContext";
import type { Aggregation } from "@/lib/istexApi";
import type { ClientComponent } from "@/types/next";

const CompatibilityPanelContent: ClientComponent<{
  compatibility?: Aggregation;
}> = ({ compatibility }) => {
  const { resultsCount } = useQueryContext();

  if (compatibility == null) {
    return null;
  }

  // JSON format is always available
  const jsonCount = resultsCount;
  const teiCount =
    (compatibility["qualityIndicators.teiSource"].buckets.find(
      ({ key }) => key === "pub2tei",
    )?.docCount ?? 0) +
    (compatibility["qualityIndicators.teiSource"].buckets.find(
      ({ key }) => key === "grobid",
    )?.docCount ?? 0);
  const cleanedCount =
    compatibility["qualityIndicators.tdmReady"].buckets.find(
      ({ keyAsString }) => keyAsString === "true",
    )?.docCount ?? 0;
  const teeftCount =
    compatibility["enrichments.type"].buckets.find(({ key }) => key === "teeft")
      ?.docCount ?? 0;

  const lodexPercentage = Math.round((jsonCount * 100) / resultsCount);
  const cortextPercentage = Math.round((teiCount * 100) / resultsCount);

  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        xs: "auto 1fr auto",
        sm: "repeat(2, auto 1fr auto)",
      }}
      alignItems="center"
      columnGap={0.625}
    >
      <CompatibilityProgress
        title={`lodex (${lodexPercentage}\u00A0%)`}
        data={[{ label: "json", count: jsonCount }]}
        total={resultsCount}
        gridColumn={1}
      />
      <CompatibilityProgress
        title={`cortext (${cortextPercentage}\u00A0%)`}
        data={[
          { label: "tei", count: teiCount },
          { label: "cleaned", count: cleanedCount },
          { label: "teeft", count: teeftCount },
        ]}
        total={resultsCount}
        gridColumn={2}
      />
    </Box>
  );
};

export default CompatibilityPanelContent;
