import { Grid2 as Grid } from "@mui/material";
import CompatibilityProgress from "./CompatibilityProgress";
import { usages, formats } from "@/config";
import { useDocumentContext } from "@/contexts/DocumentContext";
import { isFormatSelected } from "@/lib/formats";

export default function CompatibilityPanelContent() {
  const { results } = useDocumentContext();
  if (results == null) {
    return null;
  }

  // Some formats are always available
  const jsonCount = results.total;
  const modsCount = results.total;
  const txtCount =
    results.aggregations["qualityIndicators.pdfText"].buckets.find(
      ({ keyAsString }) => keyAsString === "true",
    )?.docCount ?? 0;
  const teiCount =
    (results.aggregations["qualityIndicators.teiSource"].buckets.find(
      ({ key }) => key === "pub2tei",
    )?.docCount ?? 0) +
    (results.aggregations["qualityIndicators.teiSource"].buckets.find(
      ({ key }) => key === "grobid",
    )?.docCount ?? 0);
  const cleanedCount =
    results.aggregations["qualityIndicators.tdmReady"].buckets.find(
      ({ keyAsString }) => keyAsString === "true",
    )?.docCount ?? 0;
  const teeftCount =
    results.aggregations["enrichments.type"].buckets.find(
      ({ key }) => key === "teeft",
    )?.docCount ?? 0;

  return (
    <Grid container spacing={1}>
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
          if (isFormatSelected(usage.formats, formats.metadata.mods)) {
            data.push({ label: "mods", count: modsCount });
            compatibilityCount = Math.max(modsCount, compatibilityCount);
          }
          if (isFormatSelected(usage.formats, formats.fulltext.txt)) {
            data.push({ label: "txt", count: txtCount });
            compatibilityCount = Math.max(txtCount, compatibilityCount);
          }

          return (
            <CompatibilityProgress
              key={name}
              name={name}
              compatibilityCount={compatibilityCount}
              data={data}
            />
          );
        })}
    </Grid>
  );
}
