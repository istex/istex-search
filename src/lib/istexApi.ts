import CustomError from "./CustomError";
import { buildExtractParamsFromFormats } from "./formats";
import {
  COMPATIBILITY_FACETS,
  FACETS,
  FACETS_WITH_RANGE,
  INDICATORS_FACETS,
} from "@/app/[locale]/results/facets/constants";
import { MIN_PER_PAGE, istexApiConfig, type PerPageOption } from "@/config";

export interface BuildResultPreviewUrlOptions {
  queryString: string;
  perPage?: PerPageOption;
  page?: number;
  fields?: string[];
  filters?: Filter;
  selectedDocuments?: string[];
  excludedDocuments?: string[];
}

export const createCompleteQuery = (
  queryString: string,
  filters?: Filter,
  selectedDocuments?: string[],
  excludedDocuments?: string[],
) => {
  const filtersQueryString = Object.entries(filters ?? {})
    .map(([facetName, values]) => {
      if (FACETS_WITH_RANGE.includes(facetName)) {
        const range = values[0].split("-");
        const isNot = range[0].startsWith("!");
        if (isNot) {
          range[0] = range[0].slice(1);
        }
        if (range[0].slice(-1) === ".") {
          range[0] = range[0].slice(0, -1);
        }
        if (range[1].slice(-1) === ".") {
          range[1] = range[1].slice(0, -1);
        }
        if (range[0] !== "" && range[1] !== "" && +range[0] > +range[1]) {
          const tmp = range[0];
          range[0] = range[1];
          range[1] = tmp;
        }
        if (range[0] === "") {
          range[0] = "*";
        }
        if (range[1] === "") {
          range[1] = "*";
        }
        return isNot
          ? `(NOT ${facetName}:[${range.join(" TO ")}])`
          : `${facetName}:[${range.join(" TO ")}]`;
      } else {
        return `${facetName}:(${`${values
          .filter((v) => !v.startsWith("!"))
          .map((v) => `"${v}"`)
          .join(" OR ")}${values
          .filter((v) => v.startsWith("!"))
          .map((v) => ` NOT "${v.slice(1)}"`)
          .join("")}`.trim()})`;
      }
    })
    .join(" AND ");

  const selectedDocumentsQueryString =
    selectedDocuments != null && selectedDocuments.length > 0
      ? `id:(${selectedDocuments.map((id) => `"${id}"`).join(" OR ")})`
      : "";
  const excludedDocumentsQueryString =
    excludedDocuments != null && excludedDocuments.length > 0
      ? `(NOT id:(${excludedDocuments.map((id) => `"${id}"`).join(" OR ")}))`
      : "";

  return `${
    filtersQueryString !== "" ||
    selectedDocumentsQueryString !== "" ||
    excludedDocumentsQueryString !== ""
      ? `(${queryString})`
      : queryString
  }${filtersQueryString !== "" ? ` AND ${filtersQueryString}` : ""}${
    selectedDocumentsQueryString !== ""
      ? ` AND ${selectedDocumentsQueryString}`
      : ""
  }${
    excludedDocumentsQueryString !== ""
      ? ` AND ${excludedDocumentsQueryString}`
      : ""
  }`;
};

export function buildResultPreviewUrl({
  queryString,
  perPage,
  page,
  fields,
  filters,
  selectedDocuments,
  excludedDocuments,
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
  url.searchParams.set(
    "q",
    createCompleteQuery(
      queryString,
      filters,
      selectedDocuments,
      excludedDocuments,
    ),
  );
  url.searchParams.set("size", actualPerPage.toString());
  url.searchParams.set("from", from.toString());
  url.searchParams.set("output", fields?.join(",") ?? "*");
  url.searchParams.set("sid", "istex-dl");
  url.searchParams.set(
    "facet",
    [...FACETS, ...INDICATORS_FACETS, ...COMPATIBILITY_FACETS]
      .map(
        (facet) =>
          `${facet.name}${
            facet.requestOption != null ? facet.requestOption : ""
          }`,
      )
      .filter((facet, i, arr) => arr.indexOf(facet) === i)
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
    Array<{
      extension: string;
      uri: string;
    }>
  >;
}

export type Aggregation = Record<
  string,
  {
    sumOtherDocCount?: number;
    buckets: Array<{
      key: string | number;
      keyAsString?: string;
      docCount: number;
    }>;
  }
>;

export interface IstexApiResponse {
  total: number;
  hits: Result[];
  aggregations: Aggregation;
}

export type Filter = Record<string, string[]>;

export async function getResults(
  queryString: string,
  perPage: PerPageOption,
  page: number,
  filters: Filter,
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
    filters,
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
  filters?: Filter;
  selectedDocuments?: string[];
  excludedDocuments?: string[];
}

export function buildFullApiUrl({
  queryString,
  selectedFormats,
  size,
  filters,
  selectedDocuments,
  excludedDocuments,
}: BuildFullApiUrlOptions) {
  const url = new URL("document", istexApiConfig.baseUrl);

  url.searchParams.set(
    "q",
    createCompleteQuery(
      queryString,
      filters,
      selectedDocuments,
      excludedDocuments,
    ),
  );
  url.searchParams.set("size", size.toString());
  url.searchParams.set("sid", "istex-dl");

  const extractParams = buildExtractParamsFromFormats(selectedFormats);
  if (extractParams !== "") {
    url.searchParams.set("extract", extractParams);
  }

  return url;
}
