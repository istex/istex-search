import CustomError from "./CustomError";
import { buildExtractParamsFromFormats } from "./formats";
import {
  FACETS,
  INDICATORS_FACETS,
} from "@/app/[locale]/results/facets/constants";
import { MIN_PER_PAGE, istexApiConfig, type PerPageOption } from "@/config";

export interface BuildResultPreviewUrlOptions {
  queryString: string;
  perPage?: PerPageOption;
  page?: number;
  fields?: string[];
}

export function buildResultPreviewUrl({
  queryString,
  perPage,
  page,
  fields,
}: BuildResultPreviewUrlOptions) {
  const actualPage = page ?? 1;
  let actualPerPage: number = perPage ?? MIN_PER_PAGE;

  const from = (actualPage - 1) * actualPerPage;

  // The API returns a 404 if the offset + the size exceeds the limit
  // so we have to decrease the size if it's about to go beyond the limit
  if (from + actualPerPage >= istexApiConfig.maxPaginationOffset) {
    actualPerPage = istexApiConfig.maxPaginationOffset - from;
  }

  const url = new URL("document", istexApiConfig.baseUrl);
  url.searchParams.set("q", queryString);
  url.searchParams.set("size", actualPerPage.toString());
  url.searchParams.set("from", from.toString());
  url.searchParams.set("output", fields?.join(",") ?? "*");
  url.searchParams.set("sid", "istex-dl");
  url.searchParams.set(
    "facet",
    [...FACETS, ...INDICATORS_FACETS]
      .map(
        (facet) =>
          `${facet.name}${
            facet.requestOption != null ? facet.requestOption : ""
          }`,
      )
      .join(","),
  );

  return url;
}

export interface Result {
  id: string;
  corpusName?: string;
  title?: string;
  abstract?: string;
  author?: Array<{ name?: string }>;
  host?: {
    title?: string;
    genre?: string[];
  };
  genre?: string[];
  publicationDate?: string;
  arkIstex?: string;
  fulltext?: Array<{
    extension: string;
    uri: string;
  }>;
  metadata?: Array<{
    extension: string;
    uri: string;
  }>;
  annexes?: Array<{
    extension: string;
    uri: string;
  }>;
  enrichments?: Record<
    string,
    {
      extension: string;
      uri: string;
    }
  >;
}

export type Aggregation = Record<
  string,
  {
    sumOtherDocCount?: number;
    buckets: Array<{ key: string; keyAsString?: string; docCount: number }>;
  }
>;

export interface IstexApiResponse {
  total: number;
  hits: Result[];
  aggregations: Aggregation;
}

export async function getResults(
  queryString: string,
  perPage: PerPageOption,
  page: number,
) {
  // Create the URL
  const url = buildResultPreviewUrl({
    queryString,
    perPage,
    page,
    fields: [
      "corpusName",
      "title",
      "host.title",
      "host.genre",
      "author",
      "abstract",
      "genre",
      "publicationDate",
      "arkIstex",
      "fulltext",
      "metadata",
      "annexes",
      "enrichments",
    ],
  });

  // If the query string is too long some browsers won't accept to send a GET request
  // so we send a POST request instead and pass the query string in the body
  const fetchOptions: RequestInit = { next: { revalidate: 60 } };
  if (queryString.length > istexApiConfig.queryStringMaxLength) {
    url.searchParams.delete("q");
    fetchOptions.method = "POST";
    fetchOptions.headers = {
      "Content-Type": "application/json",
    };
    fetchOptions.body = JSON.stringify({ qString: queryString });
  }

  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    throw new CustomError(
      response.status === 400 ? { name: "SyntaxError" } : { name: "default" },
    );
  }

  return (await response.json()) as IstexApiResponse;
}

export interface BuildFullApiUrlOptions {
  queryString: string;
  selectedFormats: number;
  size: number;
}

export function buildFullApiUrl({
  queryString,
  selectedFormats,
  size,
}: BuildFullApiUrlOptions) {
  const url = new URL("document", istexApiConfig.baseUrl);

  url.searchParams.set("q", queryString);
  url.searchParams.set("size", size.toString());
  url.searchParams.set("sid", "istex-dl");

  const extractParams = buildExtractParamsFromFormats(selectedFormats);
  if (extractParams !== "") {
    url.searchParams.set("extract", extractParams);
  }

  return url;
}
