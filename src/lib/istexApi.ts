import { md5 } from "js-md5";
import CustomError from "./CustomError";
import { astContainsField, astToString, type AST } from "./ast";
import { buildExtractParamsFromFormats } from "./formats";
import {
  DEFAULT_SORT_BY,
  DEFAULT_SORT_DIR,
  DISPLAY_PERF_METRICS,
  MIN_PER_PAGE,
  corpusWithExternalFulltextLink,
  istexApiConfig,
  rankValues,
  type ArchiveType,
  type CompressionLevel,
  type PerPageOption,
  type SortBy,
  type SortDir,
} from "@/config";
import type { SelectedDocument } from "@/contexts/DocumentContext";
import fields, { type Field, type FieldName } from "@/lib/fields";

export type AccessCondition = "isNotOpenAccess" | "isOpenAccess" | "unknown";

export interface Result {
  id: string;
  corpusName: string;
  title?: string;
  abstract?: string;
  doi?: string[];
  author?: { name?: string }[];
  accessCondition?: {
    contentType: AccessCondition;
  };
  fulltextUrl?: string;
  host?: {
    title?: string;
    genre?: string[];
  };
  genre?: string[];
  publicationDate?: string;
  arkIstex: string;
  fulltext?: {
    extension: string;
    uri: string;
  }[];
  metadata?: {
    extension: string;
    uri: string;
  }[];
  annexes?: {
    extension: string;
    uri: string;
  }[];
  enrichments?: Record<
    string,
    {
      extension: string;
      uri: string;
    }[]
  >;
}

export type Aggregation = Record<
  string,
  {
    sumOtherDocCount?: number;
    buckets: {
      key: string | number;
      keyAsString?: string;
      docCount: number;
      from?: number;
      fromAsString?: string;
      to?: number;
      toAsString?: string;
    }[];
  }
>;

export interface IstexApiResponse {
  stats?: {
    elasticsearch: {
      took: number;
    };
    "istex-api": {
      took: number;
    };
  };
  total: number;
  prevPageURI?: string;
  nextPageURI?: string;
  firstPageURI?: string;
  lastPageURI?: string;
  hits: Result[];
  aggregations: Aggregation;
}

export function createCompleteQuery(
  queryString: string,
  filters?: AST,
  selectedDocuments?: SelectedDocument[],
  excludedDocuments?: string[],
) {
  if (selectedDocuments != null && selectedDocuments.length > 0) {
    return `arkIstex.raw:(${selectedDocuments
      .map((doc) => `"${doc.arkIstex}"`)
      .join(" ")})`;
  }

  const filtersQueryString = filters != null ? astToString(filters) : "";

  const excludedDocumentsQueryString =
    excludedDocuments != null && excludedDocuments.length > 0
      ? `(NOT arkIstex.raw:(${excludedDocuments
          .map((ark) => `"${ark}"`)
          .join(" ")}))`
      : "";

  let completeQueryString = queryString;

  if (filtersQueryString !== "") {
    // The filter query contains the operator to link it with the base query
    completeQueryString = `(${completeQueryString}) ${filtersQueryString}`;
  }

  if (excludedDocumentsQueryString !== "") {
    completeQueryString = `(${completeQueryString}) AND ${excludedDocumentsQueryString}`;
  }

  return completeQueryString;
}

export function setSearchParamsSorting(
  searchParams: URLSearchParams,
  sortBy: SortBy,
  sortDir: SortDir,
) {
  const sortParams = rankValues.some((value) => value === sortBy)
    ? "rankBy"
    : "sortBy";

  searchParams.set(
    sortParams,
    `${sortBy}${sortParams === "sortBy" ? `[${sortDir}]` : ""}`,
  );
}

export interface BuildResultPreviewUrlOptions {
  queryString: string;
  perPage?: PerPageOption;
  page?: number;
  fields?: string[];
  filters?: AST;
  selectedDocuments?: SelectedDocument[];
  excludedDocuments?: string[];
  sortBy?: SortBy;
  sortDir?: SortDir;
  randomSeed?: string;
  stats?: boolean;
}

export function buildResultPreviewUrl({
  queryString,
  perPage,
  page,
  fields,
  filters,
  selectedDocuments,
  excludedDocuments,
  sortBy,
  sortDir,
  randomSeed,
  stats = false,
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
  setSearchParamsSorting(
    url.searchParams,
    sortBy ?? DEFAULT_SORT_BY,
    sortDir ?? DEFAULT_SORT_DIR,
  );
  if (randomSeed != null) {
    url.searchParams.set("randomSeed", randomSeed);
  }
  url.searchParams.set(
    "output",
    (fields ?? istexApiConfig.defaultFields).join(","),
  );
  url.searchParams.set("sid", "istex-search");
  url.searchParams.set("facet", getFacetUrlParam(filters));
  if (stats) {
    url.searchParams.set("stats", "");
  }

  return url;
}

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
  const fetchOptions: RequestInit = { next: { revalidate: 60 } };
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

export async function getAggregation(
  field: Field,
  queryString: string,
  filters?: AST,
) {
  const finalQueryString = createCompleteQuery(queryString, filters);

  const url = new URL("document", istexApiConfig.baseUrl);
  url.searchParams.set("size", "0");
  url.searchParams.set("sid", "istex-search");
  url.searchParams.set("facet", fieldToFacetParam(field));

  // If the query string is too long some browsers won't accept to send a GET request
  // so we send a POST request instead and pass the query string in the body
  const fetchOptions: RequestInit = {};
  if (finalQueryString.length > istexApiConfig.queryStringMaxLength) {
    fetchOptions.method = "POST";
    fetchOptions.headers = {
      "Content-Type": "application/json",
    };
    fetchOptions.body = JSON.stringify({ qString: finalQueryString });
  } else {
    url.searchParams.set("q", finalQueryString);
  }

  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    throw new CustomError({ name: "GetAggregationError" });
  }

  const data = (await response.json()) as IstexApiResponse;

  return data.aggregations[field.name].buckets;
}

export async function getPossibleValues(fieldName: FieldName) {
  const field = fields.find((field) => field.name === fieldName);
  if (field == null) {
    throw new Error(`Could not find the ${fieldName} field.`);
  }

  const aggregation = await getAggregation(field, "*");

  return aggregation.map(
    ({ key, keyAsString }) => keyAsString ?? key.toString(),
  );
}

export interface BuildFullApiUrlOptions {
  queryString?: string;
  qId?: string;
  selectedFormats: number;
  size: number;
  filters?: AST;
  selectedDocuments?: SelectedDocument[];
  excludedDocuments?: string[];
  sortBy?: SortBy;
  sortDir?: SortDir;
  randomSeed?: string;
  archiveType?: ArchiveType;
  compressionLevel?: CompressionLevel;
}

export function buildFullApiUrl({
  queryString,
  qId,
  selectedFormats,
  size,
  filters,
  selectedDocuments,
  excludedDocuments,
  sortBy,
  sortDir,
  randomSeed,
  archiveType,
  compressionLevel,
}: BuildFullApiUrlOptions) {
  const url = new URL("document", istexApiConfig.baseUrl);

  if (queryString != null) {
    const fullQueryString = createCompleteQuery(
      queryString,
      filters,
      selectedDocuments,
      excludedDocuments,
    );

    // If the queryString is too long, use a q_id instead
    if (fullQueryString.length > istexApiConfig.queryStringMaxLength) {
      const qId = md5(fullQueryString);
      url.searchParams.set("q_id", qId);
    } else {
      url.searchParams.set("q", fullQueryString);
    }
  } else if (qId != null) {
    url.searchParams.set("q_id", qId);
  }

  url.searchParams.set("size", size.toString());
  setSearchParamsSorting(
    url.searchParams,
    sortBy ?? DEFAULT_SORT_BY,
    sortDir ?? DEFAULT_SORT_DIR,
  );
  if (randomSeed != null) {
    url.searchParams.set("randomSeed", randomSeed);
  }
  if (archiveType != null) {
    url.searchParams.set("archiveType", archiveType);
  }
  if (compressionLevel != null) {
    url.searchParams.set("compressionLevel", compressionLevel.toString());
  }
  url.searchParams.set("sid", "istex-search");

  const extractParams = buildExtractParamsFromFormats(selectedFormats);
  if (extractParams !== "") {
    url.searchParams.set("extract", extractParams);
  }

  return url;
}

export function getExternalPdfUrl(document: Result) {
  const { corpusName, doi, fulltextUrl } = document;
  const showExternalUrl = corpusWithExternalFulltextLink.includes(corpusName);

  if (showExternalUrl) {
    if (doi != null && doi.length > 0) {
      return new URL(doi[0], "https://doi.org/");
    }

    if (fulltextUrl != null && fulltextUrl !== "") {
      return new URL(fulltextUrl);
    }
  }

  return null;
}

const FILTER_FIELDS = fields.filter((field) => field.inFilters === true);

const INDICATORS_FIELDNAMES: readonly FieldName[] = [
  "qualityIndicators.abstractCharCount",
  "qualityIndicators.pdfText",
  "qualityIndicators.tdmReady",
  "qualityIndicators.teiSource",
  "enrichments.type",
  "language",
];
const INDICATORS_FIELDS = fields.filter((field) =>
  INDICATORS_FIELDNAMES.includes(field.name),
);

function fieldToFacetParam(field: Field) {
  let param = field.name;

  if (field.aggregationParameters != null) {
    param += field.aggregationParameters;
  } else if (field.type === "text" || field.type === "language") {
    param += "[*]";
  }

  return param;
}

function getFacetUrlParam(filters?: AST) {
  const finalFields = [];

  // If filters are active, only ask for aggregations on the fields with an active filter, otherwise,
  // ask on the fields that are open by default
  if (filters != null && filters.length > 0) {
    finalFields.push(
      ...FILTER_FIELDS.filter((field) => astContainsField(filters, field)),
    );
  } else {
    finalFields.push(
      ...FILTER_FIELDS.filter((field) => field.defaultOpen === true),
    );
  }

  finalFields.push(...INDICATORS_FIELDS);

  return finalFields.map(fieldToFacetParam).join(",");
}
