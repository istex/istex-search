import InfoIcon from "@mui/icons-material/Info";
import { Stack, Tooltip, Typography } from "@mui/material";
import type * as React from "react";
import Panel from "@/components/Panel";
import type { IstexApiResponse } from "@/lib/istexApi";
import RenderingMetric from "./RenderingMetric";

// Very arbitrary time in milliseconds below which we consider the fetch
// call hit cache
const CACHE_TIME_THRESHOLD = 100;

export interface PerfMetricsProps {
  istexApiStats: IstexApiResponse["stats"];
}

export default function PerfMetrics({ istexApiStats }: PerfMetricsProps) {
  if (istexApiStats == null) {
    throw new Error(
      "Missing stats in the API response. This should not happen.",
    );
  }

  const hasMarkers =
    performance.getEntriesByName("before_fetch").length > 0 &&
    performance.getEntriesByName("after_fetch").length > 0 &&
    performance.getEntriesByName("before_parsing").length > 0 &&
    performance.getEntriesByName("after_parsing").length > 0;
  if (!hasMarkers) {
    return null;
  }

  const fetchMesure = performance.measure(
    "fetch",
    "before_fetch",
    "after_fetch",
  );
  const parsingMesure = performance.measure(
    "parsing",
    "before_parsing",
    "after_parsing",
  );
  performance.clearMarks();
  performance.clearMeasures();

  const hitCache = fetchMesure.duration < CACHE_TIME_THRESHOLD;

  const istexApiTime = !hitCache ? istexApiStats["istex-api"].took : 0;
  const elasticTime = !hitCache ? istexApiStats.elasticsearch.took : 0;
  const networkOverhead = !hitCache
    ? fetchMesure.duration - (istexApiTime + elasticTime)
    : 0;

  const endFetchTime =
    performance.timeOrigin + fetchMesure.startTime + fetchMesure.duration;

  return (
    <Panel
      heading="Performance metrics"
      sx={{
        "&&": {
          bgcolor: "colors.white",
        },
      }}
    >
      <Stack spacing={0.5}>
        <PerfMetric
          tooltipContent={
            <>
              The amount of time spent by the API in pure compute. The time
              between the moment the API receives the request and the moment it
              starts sending the reponse, minus the time waiting for
              Elasticsearch. This metric is calculated by the API.
            </>
          }
        >
          Istex API:{" "}
          <strong>
            {istexApiTime}ms{hitCache && " (cached)"}
          </strong>
        </PerfMetric>

        <PerfMetric
          tooltipContent={
            <>
              The amount of time spent by Elasticsearch in pure compute. This
              metric is calculated by Elasticsearch.
            </>
          }
        >
          Elasticsearch:{" "}
          <strong>
            {elasticTime}ms{hitCache && " (cached)"}
          </strong>
        </PerfMetric>

        <PerfMetric
          tooltipContent={
            <>
              The amount of time between the moment the request is sent to API
              and the moment the response is received. This metric is calculated
              by Istex Search.
            </>
          }
        >
          Complete request:{" "}
          <strong>
            {fetchMesure.duration.toFixed(0)}ms{hitCache && " (cached)"}
          </strong>
        </PerfMetric>

        <PerfMetric
          tooltipContent={
            <>
              The amount of time spent turning the API response from a string to
              a usable JavaScript object.
            </>
          }
        >
          Parsing response:{" "}
          <strong>{parsingMesure.duration.toFixed(0)}ms</strong>
        </PerfMetric>

        <PerfMetric
          tooltipContent={
            <>
              The difference between the amount of time spent waiting for the
              API to respond and the total API compute time (pure API compute +
              Elasticsearch).
            </>
          }
        >
          Network overhead:{" "}
          <strong>
            {networkOverhead.toFixed(0)}ms{hitCache && " (cached)"}
          </strong>
        </PerfMetric>

        <RenderingMetric endFetchTime={endFetchTime} />
      </Stack>
    </Panel>
  );
}

interface PerfMetricProps {
  tooltipContent: React.ReactNode;
  children: React.ReactNode;
}

export function PerfMetric({ tooltipContent, children }: PerfMetricProps) {
  return (
    <Stack direction="row" spacing={0.5}>
      <Tooltip title={tooltipContent} placement="left">
        <InfoIcon fontSize="small" color="primary" />
      </Tooltip>
      <Typography variant="body2">{children}</Typography>
    </Stack>
  );
}
