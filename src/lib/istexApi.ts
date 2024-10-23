import { md5 } from "js-md5";
import CustomError from "./CustomError";
import { astToString, type AST, type FieldName } from "./ast";
import { buildExtractParamsFromFormats } from "./formats";
import fields from "@/app/[locale]/results/components/Filters/fields";
import {
  DEFAULT_SORT_BY,
  DEFAULT_SORT_DIR,
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
  url.searchParams.set(
    "facet",
    getFacetUrlParam() +
      ",qualityIndicators.abstractCharCount[1-1000000],qualityIndicators.pdfText,qualityIndicators.tdmReady,qualityIndicators.teiSource",
  );

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
}

export async function getResults({
  queryString,
  perPage,
  page,
  filters,
  sortBy,
  sortDir,
  randomSeed,
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

  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    throw new CustomError(
      response.status === 400 ? { name: "SyntaxError" } : { name: "default" },
    );
  }

  return (await response.json()) as IstexApiResponse;
}

export async function getPossibleValues(fieldName: FieldName) {
  const url = new URL("document", istexApiConfig.baseUrl);
  url.searchParams.set("q", "*");
  url.searchParams.set("size", "0");
  url.searchParams.set("sid", "istex-search");
  url.searchParams.set("facet", `${fieldName}[*]`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new CustomError({ name: "default" });
  }

  const data = (await response.json()) as IstexApiResponse;

  return data.aggregations[fieldName].buckets.map(
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

function getFacetUrlParam() {
  return fields
    .map((field) => {
      let value = field.name;

      if (field.type === "text" || field.type === "language") {
        value += "[*]";
      }

      return value;
    })
    .join(",");
}
