import { md5 } from "js-md5";
import { useQueryState, useQueryStates } from "nuqs";
import {
  createLoader,
  createParser,
  createSerializer,
  type inferParserType,
  type Nullable,
  type Options,
  parseAsIndex,
  parseAsJson,
  parseAsNumberLiteral,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";
import {
  compressionLevels,
  DEFAULT_COMPRESSION_LEVEL,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_DIRECTION,
  DEFAULT_USAGE_NAME,
  istexApiConfig,
  MIN_PER_PAGE,
  type PerPageOption,
  perPageOptions,
  rankValues,
  SEARCH_MODE_REGULAR,
  searchModes,
  sortDirections,
  sortFields,
  type UsageName,
  usageNames,
  usages,
} from "@/config";
import { type AST, getEmptyAst } from "./ast";
import CustomError from "./CustomError";
import { buildExtractParamsFromFormats, parseExtractParams } from "./formats";
import logger from "./logger";
import { clamp, isValidMd5 } from "./utils";

// TODO: Remove as many custom parsers as possible once nuqs supports schema validation.

export const searchParamsParsers = {
  queryString: parseAsString,

  qId: parseAsString,

  prompt: parseAsString.withDefault(""),

  formats: createParser({
    parse: parseExtractParams,
    serialize: buildExtractParamsFromFormats,
  }).withDefault(0),

  usageName: parseAsStringLiteral(usageNames).withDefault(DEFAULT_USAGE_NAME),

  size: parseAsClampedInteger(0, istexApiConfig.maxSize).withDefault(0),

  page: parseAsIndex.withDefault(0),

  perPage: parseAsNumberLiteral(perPageOptions).withDefault(MIN_PER_PAGE),

  filters: parseAsBase64Json<AST>().withDefault([]),

  compressionLevel: parseAsNumberLiteral(compressionLevels).withDefault(
    DEFAULT_COMPRESSION_LEVEL,
  ),

  searchMode:
    parseAsStringLiteral(searchModes).withDefault(SEARCH_MODE_REGULAR),

  ast: parseAsJson((value) => value as AST),

  sortBy: parseAsStringLiteral([...rankValues, ...sortFields]).withDefault(
    DEFAULT_SORT_BY,
  ),

  sortDirection: parseAsStringLiteral(sortDirections).withDefault(
    DEFAULT_SORT_DIRECTION,
  ),

  randomSeed: parseAsString,
};

export type SearchParams = Partial<
  Nullable<inferParserType<typeof searchParamsParsers>>
>;

export function createArchiveTypeParser(usageName: UsageName) {
  const allowedArchiveTypes = usages[usageName].archiveTypes;
  const defaultArchiveType = allowedArchiveTypes[0];

  return parseAsStringLiteral(allowedArchiveTypes).withDefault(
    defaultArchiveType,
  );
}

export const loadSearchParams = createLoader(searchParamsParsers, {
  urlKeys: {
    queryString: "q",
    qId: "q_id",
    formats: "extract",
  },
});

export const serializeSearchParams = createSerializer(searchParamsParsers, {
  urlKeys: {
    queryString: "q",
    qId: "q_id",
    formats: "extract",
  },
});

export async function getQueryStringFromQId(qId: string) {
  if (!isValidMd5(qId)) {
    throw new CustomError({ name: "QIdNotFoundError", qId });
  }

  const url = new URL(`q_id/${qId}`, istexApiConfig.getBaseUrl());

  const response = await fetch(url);
  if (!response.ok) {
    throw new CustomError(
      response.status === 404
        ? { name: "QIdNotFoundError", qId }
        : { name: "default" },
    );
  }

  const body = (await response.json()) as unknown;
  if (
    typeof body !== "object" ||
    body == null ||
    !("req" in body) ||
    typeof body.req !== "string"
  ) {
    logger.error(
      `Incorrect response structure while getting the query for the q_id ${qId}`,
    );

    throw new CustomError({ name: "default" });
  }

  return body.req;
}

export async function generateQIdFromQueryString(queryString: string) {
  const qId = md5(queryString);
  const url = new URL(`/q_id/${qId}`, istexApiConfig.getBaseUrl());
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ qString: queryString }),
  });

  // 409 responses are expected because, in some scenarios, the q_id will
  // already be saved the in the redis base.
  if (!response.ok && response.status !== 409) {
    throw new CustomError({ name: "QIdSaveError", qId });
  }

  return qId;
}

export function usePrompt() {
  return useQueryState("prompt", searchParamsParsers.prompt);
}

export function useSelectedFormats() {
  return useQueryState("extract", searchParamsParsers.formats);
}

export function useUsageName() {
  return useQueryState("usage", searchParamsParsers.usageName);
}

// This hook shouldn't be used directly because it doesn't do clamping based
// on the amount of results nor the selected/excluded documents. Components
// should use useSize() from @/lib/hooks.ts instead.
export function useRawSize() {
  return useQueryState("size", searchParamsParsers.size);
}

// This hook shouldn't be used directly because it doesn't do clamping based
// on the amount of results. Components should use usePagination() from
// @/lib/hooks.ts instead.
export function useRawPagination() {
  const [{ page, perPage }, setPagination] = useQueryStates({
    page: searchParamsParsers.page,
    perPage: searchParamsParsers.perPage,
  });

  const setPage = (newPage: number | null, options?: Options) => {
    setPagination({ page: newPage }, options);
  };

  const setPerPage = (newPerPage: PerPageOption | null, options?: Options) => {
    setPagination({ page: null, perPage: newPerPage }, options);
  };

  return { page, perPage, setPage, setPerPage };
}

export function useArchiveType() {
  const [usageName] = useUsageName();

  return useQueryState("archiveType", createArchiveTypeParser(usageName));
}

export function useFilters() {
  return useQueryState("filters", searchParamsParsers.filters);
}

export function useCompressionLevel() {
  return useQueryState(
    "compressionLevel",
    searchParamsParsers.compressionLevel,
  );
}

export function useSearchMode() {
  return useQueryState("searchMode", searchParamsParsers.searchMode);
}

export function useAst() {
  const [ast, setAst] = useQueryState("ast", searchParamsParsers.ast);

  return [ast ?? getEmptyAst(), setAst] as const;
}

export function useSortBy() {
  return useQueryState("sortBy", searchParamsParsers.sortBy);
}

export function useSortDirection() {
  return useQueryState("sortDirection", searchParamsParsers.sortDirection);
}

export function useRandomSeed() {
  return useQueryState("randomSeed", searchParamsParsers.randomSeed);
}

function parseAsClampedInteger(min: number, max: number) {
  return createParser({
    parse: (value) => {
      const valueAsNumber = Number(value);
      if (Number.isNaN(valueAsNumber)) {
        return null;
      }

      return clamp(Math.round(valueAsNumber), min, max);
    },
    serialize: (value) => {
      return clamp(Math.round(value), min, max).toString();
    },
  });
}

function parseAsBase64Json<T>() {
  return createParser<T>({
    parse: (value) => JSON.parse(atob(value)),
    serialize: (value) => btoa(JSON.stringify(value)),
  });
}
