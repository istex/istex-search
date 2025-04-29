import * as React from "react";
import InfoIcon from "@mui/icons-material/Info";
import { Stack, Tooltip, Typography } from "@mui/material";
import RenderingMetric from "./RenderingMetric";
import Panel from "@/components/Panel";
import type { IstexApiResponse } from "@/lib/istexApi";

export interface PerfMetricsProps {
  istexApiStats: IstexApiResponse["stats"];
}

export default function PerfMetrics({ istexApiStats }: PerfMetricsProps) {
  if (istexApiStats == null) {
    throw new Error(
      "Missing stats in the API response. This should not happen.",
    );
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

  const istexApiTime = istexApiStats["istex-api"].took;
  const elasticTime = istexApiStats.elasticsearch.took;
  const networkOverhead = fetchMesure.duration - (istexApiTime + elasticTime);

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
          Istex API: <strong>{istexApiTime}ms</strong>
        </PerfMetric>

        <PerfMetric
          tooltipContent={
            <>
              The amount of time spent by Elasticsearch in pure compute. This
              metric is calculated by Elasticsearch.
            </>
          }
        >
          Elasticsearch: <strong>{istexApiStats.elasticsearch.took}ms</strong>
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
          Complete request: <strong>{fetchMesure.duration.toFixed(0)}ms</strong>
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
          Network overhead: <strong>{networkOverhead.toFixed(0)}ms</strong>
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
