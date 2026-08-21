import { cacheLife } from "next/cache";
import {
  DISPLAY_PERF_METRICS,
  istexApiConfig,
  type PerPageOption,
  type SortBy,
  type SortDir,
} from "@/config";
import type { AST } from "./ast";
import CustomError from "./CustomError";
import { buildResultPreviewUrl, type IstexApiResponse } from "./istexApi";

// NOTE:
// The getResults function used to live in istexApi.ts and was moved to a
// separate file to make sure it's only imported from server components. It
// can only be imported from server components because it uses the "use cache"
// directive.
// A better solution would be to get rid of caching entirely, but that requires
// reworking the download form entirely so that it stops calling router.replace
// all the time.

export interface GetResultsOptions {
  queryString: string;
  perPage: PerPageOption;
  page: number;
  filters: AST;
  sortBy: SortBy;
  sortDir: SortDir;
  randomSeed?: string;
  stats?: boolean;
}

export async function getResults({
  queryString,
  perPage,
  page,
  filters,
  sortBy,
  sortDir,
  randomSeed,
  stats,
}: GetResultsOptions) {
  "use cache";
  cacheLife("minutes");

  // Create the URL
  const url = buildResultPreviewUrl({
    queryString,
    perPage,
    page,
    filters,
    sortBy,
    sortDir,
    randomSeed,
    stats,
  });

  // The final query string is built from the initial query string + the filters
  const finalQueryString = url.searchParams.get("q") ?? "";

  // If the query string is too long some browsers won't accept to send a GET request
  // so we send a POST request instead and pass the query string in the body
  const fetchOptions: RequestInit = {};
  if (finalQueryString.length > istexApiConfig.queryStringMaxLength) {
    url.searchParams.delete("q");
    fetchOptions.method = "POST";
    fetchOptions.headers = {
      "Content-Type": "application/json",
    };
    fetchOptions.body = JSON.stringify({ qString: finalQueryString });
  }

  if (DISPLAY_PERF_METRICS) performance.mark("before_fetch");
  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    throw new CustomError(
      response.status === 400 ? { name: "SyntaxError" } : { name: "default" },
    );
  }
  if (DISPLAY_PERF_METRICS) performance.mark("after_fetch");

  if (DISPLAY_PERF_METRICS) performance.mark("before_parsing");
  const res = (await response.json()) as IstexApiResponse;
  if (DISPLAY_PERF_METRICS) performance.mark("after_parsing");

  return res;
}
