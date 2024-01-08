"use client";

import { Box } from "@mui/material";
import CompatibilityProgress from "./CompatibilityProgress";
import { usages } from "@/config";
import { useQueryContext } from "@/contexts/QueryContext";
import { buildExtractParamsFromFormats } from "@/lib/formats";
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
          let compatibilityCount = 0;
          const formats: string[] = [];
          buildExtractParamsFromFormats(usage.formats)
            .split(";")
            .forEach((category) => {
              formats.push(...category.split(/[[\]]/)[1].split(","));
            });
          const data: Array<{ label: string; count: number }> = [];
          formats.forEach((format) => {
            switch (format) {
              case "tei":
                data.push({ label: "tei", count: teiCount });
                compatibilityCount =
                  teiCount > compatibilityCount ? teiCount : compatibilityCount;
                break;
              case "cleaned":
                data.push({ label: "cleaned", count: cleanedCount });
                compatibilityCount =
                  cleanedCount > compatibilityCount
                    ? cleanedCount
                    : compatibilityCount;
                break;
              case "teeft":
                data.push({ label: "teeft", count: teeftCount });
                compatibilityCount =
                  teeftCount > compatibilityCount
                    ? teeftCount
                    : compatibilityCount;
                break;
              case "json":
                data.push({ label: "json", count: jsonCount });
                compatibilityCount =
                  jsonCount > compatibilityCount
                    ? jsonCount
                    : compatibilityCount;
                break;
            }
          });

          return (
            <CompatibilityProgress
              key={name}
              title={`${name} (${Math.round(
                (compatibilityCount * 100) / resultsCount,
              )}\u00A0%)`}
              data={data}
              total={resultsCount}
              gridColumn={usage.column}
              gridRow={usage.row}
            />
          );
        })}
    </Box>
  );
};

export default CompatibilityPanelContent;
