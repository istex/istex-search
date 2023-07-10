import type { NextSearchParams } from "@/types/next";

export function nextSearchParamsToUrlSearchParams(
  nextSearchParams: NextSearchParams
): URLSearchParams {
  const urlSearchParams = new URLSearchParams();

  for (const paramName in nextSearchParams) {
    const param = nextSearchParams[paramName];
    if (param == null) {
      continue;
    }

    if (typeof param === "string") {
      urlSearchParams.set(paramName, param);
    } else if (Array.isArray(param)) {
      for (const p of param) {
        urlSearchParams.append(paramName, p);
      }
    }
  }

  return urlSearchParams;
}
