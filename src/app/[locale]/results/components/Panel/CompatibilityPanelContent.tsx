"use client";

import { Box } from "@mui/material";
import CompatibilityProgress from "./CompatibilityProgress";
import { usages, formats } from "@/config";
import { useQueryContext } from "@/contexts/QueryContext";
import { isFormatSelected } from "@/lib/formats";
import type { Aggregation } from "@/lib/istexApi";

interface CompatibilityPanelContentProps {
  compatibility: Aggregation;
}

export default function CompatibilityPanelContent({
  compatibility,
}: CompatibilityPanelContentProps) {
  const { resultsCount } = useQueryContext();

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
      {Object.entries(usages)
        .filter(([_, { isGateway }]) => isGateway)
        .map(([name, usage]) => {
          const data: { label: string; count: number }[] = [];
          let compatibilityCount = 0;

          if (isFormatSelected(usage.formats, formats.fulltext.tei)) {
            data.push({ label: "tei", count: teiCount });
            compatibilityCount = Math.max(teiCount, compatibilityCount);
          }
          if (isFormatSelected(usage.formats, formats.fulltext.cleaned)) {
            data.push({ label: "cleaned", count: cleanedCount });
            compatibilityCount = Math.max(cleanedCount, compatibilityCount);
          }
          if (isFormatSelected(usage.formats, formats.enrichments.teeft)) {
            data.push({ label: "teeft", count: teeftCount });
            compatibilityCount = Math.max(teeftCount, compatibilityCount);
          }
          if (isFormatSelected(usage.formats, formats.metadata.json)) {
            data.push({ label: "json", count: jsonCount });
            compatibilityCount = Math.max(jsonCount, compatibilityCount);
          }

          return (
            <CompatibilityProgress
              key={name}
              name={name}
              compatibilityCount={compatibilityCount}
              data={data}
              gridColumn={usage.column}
              gridRow={usage.row}
            />
          );
        })}
    </Box>
  );
}
