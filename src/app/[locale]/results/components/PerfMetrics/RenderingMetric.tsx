"use client";

import * as React from "react";
import { PerfMetric } from "./PerfMetrics";

interface RenderingMetricProps {
  endFetchTime: number;
}

export default function RenderingMetric({
  endFetchTime,
}: RenderingMetricProps) {
  const [renderTime, setRenderTime] = React.useState(0);

  React.useLayoutEffect(() => {
    setRenderTime(Date.now() - endFetchTime);
  }, [endFetchTime]);

  return (
    <PerfMetric
      tooltipContent={
        <>
          The amount of time spent by Istex Search rendering. The time between
          the moment the Istex Search server receives the response from the API
          and the moment the browser is done rendering.
        </>
      }
    >
      Render time: <strong>{renderTime.toFixed(0)}ms</strong>
    </PerfMetric>
  );
}
