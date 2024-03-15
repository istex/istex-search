import {
  ReadonlyURLSearchParams,
  useSearchParams as nextUseSearchParams,
} from "next/navigation";
import { md5 } from "js-md5";
import CustomError from "./CustomError";
import { type AST, getEmptyAst } from "./assistedSearch/ast";
import { buildExtractParamsFromFormats, parseExtractParams } from "./formats";
import type { Filter } from "./istexApi";
import { clamp, closest, isValidMd5 } from "./utils";
import {
  DEFAULT_SORT_BY,
  DEFAULT_SORT_DIR,
  DEFAULT_USAGE_NAME,
  MIN_PER_PAGE,
  NO_FORMAT_SELECTED,
  istexApiConfig,
  perPageOptions,
  usages,
  type PerPageOption,
  type SortBy,
  type SortDir,
  type UsageName,
  type SearchMode,
  SEARCH_MODE_REGULAR,
} from "@/config";
import type { NextSearchParams } from "@/types/next";

// Wrapper class around URLSearchParams with stricter getters and setters
export class SearchParams {
  private readonly searchParams: URLSearchParams;

  constructor(searchParams: ReadonlyURLSearchParams | NextSearchParams) {
    this.searchParams =
      searchParams instanceof ReadonlyURLSearchParams
        ? new URLSearchParams(searchParams.toString())
        : this._nextSearchParamsToUrlSearchParams(searchParams);
  }

  async getQueryString(): Promise<string> {
    const queryString = this.searchParams.get("q")?.trim();
    const qId = this.searchParams.get("q_id");
    const isQueryStringPresent = queryString != null && queryString !== "";
    const isQIdPresent = qId != null && isValidMd5(qId);

    if (isQueryStringPresent) {
      return queryString;
    }

    if (isQIdPresent) {
      const url = new URL(`q_id/${qId}`, istexApiConfig.baseUrl);

      const response = await fetch(url);
      if (!response.ok) {
        throw new CustomError(
          response.status === 404
            ? { name: "QIdNotFoundError", qId }
            : { name: "default" },
        );
      }

      return (await response.json()).req as string;
    }

    return "";
  }

  async setQueryString(queryString: string): Promise<void> {
    queryString = queryString.trim();

    // Remove q_id and q params to start fresh and make sure
    // q_id and q are never set at the same time
    this.deleteQueryString();

    if (queryString === "") {
      return;
    }

    if (queryString.length > istexApiConfig.queryStringMaxLength) {
      const qId = md5(queryString);
      const url = new URL(`q_id/${qId}`, istexApiConfig.baseUrl);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ qString: queryString }),
      });

      // 409 responses are expected because, in some scenarios, the q_id will
      // already be saved the in the redis base
      if (!response.ok && response.status !== 409) {
        throw new CustomError({ name: "QIdSaveError", qId });
      }

      this.searchParams.set("q_id", qId);

      return;
    }

    this.searchParams.set("q", queryString);
  }

  deleteQueryString(): void {
    this.searchParams.delete("q");
    this.searchParams.delete("q_id");
  }

  getFormats(): number {
    const extractParams = this.searchParams.get("extract");
    if (extractParams == null) {
      return NO_FORMAT_SELECTED;
    }

    return parseExtractParams(extractParams);
  }

  setFormats(value: number): void {
    if (value === NO_FORMAT_SELECTED) {
      this.deleteFormats();
      return;
    }

    this.searchParams.set("extract", buildExtractParamsFromFormats(value));
  }

  deleteFormats(): void {
    this.searchParams.delete("extract");
  }

  getUsageName(): UsageName {
    const value = this.searchParams.get("usage");
    if (value == null) {
      return DEFAULT_USAGE_NAME;
    }

    if (!Object.keys(usages).includes(value)) {
      return DEFAULT_USAGE_NAME;
    }

    return value as UsageName;
  }

  setUsageName(value: UsageName): void {
    if (value === DEFAULT_USAGE_NAME) {
      this.deleteUsageName();
      return;
    }

    this.searchParams.set("usage", value);
  }

  deleteUsageName(): void {
    this.searchParams.delete("usage");
  }

  getSize(): number {
    const value = this.searchParams.get("size");
    const valueAsNumber = Number(value);
    if (value == null || Number.isNaN(valueAsNumber)) {
      return 0;
    }

    return clamp(Math.round(valueAsNumber), 0, istexApiConfig.maxSize);
  }

  setSize(value: number): void {
    if (value === 0) {
      this.deleteSize();
      return;
    }

    this.searchParams.set(
      "size",
      clamp(Math.round(value), 0, istexApiConfig.maxSize).toString(),
    );
  }

  deleteSize(): void {
    this.searchParams.delete("size");
  }

  getPage(): number {
    const value = this.searchParams.get("page");
    const valueAsNumber = Number(value);
    if (value == null || Number.isNaN(valueAsNumber)) {
      return 1;
    }

    return clamp(
      Math.round(valueAsNumber),
      1,
      Math.ceil(istexApiConfig.maxPaginationOffset / this.getPerPage()),
    );
  }

  setPage(value: number): void {
    if (value === 1) {
      this.deletePage();
      return;
    }

    this.searchParams.set(
      "page",
      clamp(
        Math.round(value),
        1,
        Math.ceil(istexApiConfig.maxPaginationOffset / this.getPerPage()),
      ).toString(),
    );
  }

  deletePage(): void {
    this.searchParams.delete("page");
  }

  getPerPage(): PerPageOption {
    const value = this.searchParams.get("perPage");
    const valueAsNumber = Number(value);
    if (value == null || Number.isNaN(valueAsNumber)) {
      return MIN_PER_PAGE;
    }

    return closest(valueAsNumber, perPageOptions) as PerPageOption;
  }

  setPerPage(value: PerPageOption): void {
    if (value === MIN_PER_PAGE) {
      this.deletePerPage();
      return;
    }

    this.searchParams.set("perPage", value.toString());
  }

  deletePerPage(): void {
    this.searchParams.delete("perPage");
  }

  getFilters(): Filter {
    const value = this.searchParams.get("filter");
    if (value == null) {
      return {};
    }

    return JSON.parse(value);
  }

  setFilters(value: Filter): void {
    if (Object.keys(value).length === 0) {
      this.deleteFilters();
      return;
    }

    this.searchParams.set("filter", JSON.stringify(value));
  }

  deleteFilters(): void {
    this.searchParams.delete("filter");
  }

  getLastAppliedFacet(): string {
    const value = this.searchParams.get("lastAppliedFacet");
    if (value == null) {
      return "";
    }

    return value;
  }

  setLastAppliedFacet(value: string): void {
    if (value === "") {
      this.deleteLastAppliedFacet();
      return;
    }

    this.searchParams.set("lastAppliedFacet", value);
  }

  deleteLastAppliedFacet(): void {
    this.searchParams.delete("lastAppliedFacet");
  }

  getSearchMode(): SearchMode {
    const value = this.searchParams.get("searchMode");
    if (value === null) {
      return SEARCH_MODE_REGULAR;
    }

    return value as SearchMode;
  }

  setSearchMode(value: SearchMode): void {
    if (value === SEARCH_MODE_REGULAR) {
      this.deleteSearchMode();
      return;
    }

    this.searchParams.set("searchMode", value);
  }

  deleteSearchMode(): void {
    this.searchParams.delete("searchMode");
  }

  getAst(): AST {
    const base64Ast = this.searchParams.get("ast");
    if (base64Ast === null) {
      return getEmptyAst();
    }

    try {
      return JSON.parse(atob(base64Ast)) as AST;
    } catch (error) {
      return getEmptyAst();
    }
  }

  setAst(ast: AST): void {
    const base64Ast = btoa(JSON.stringify(ast));
    this.searchParams.set("ast", base64Ast);
  }

  deleteAst(): void {
    this.searchParams.delete("ast");
  }

  getSortBy(): SortBy {
    const value = this.searchParams.get("sortBy");
    if (value == null) {
      return DEFAULT_SORT_BY;
    }

    return value as SortBy;
  }

  setSortBy(value: SortBy): void {
    if (value === DEFAULT_SORT_BY) {
      this.deleteSortBy();
      return;
    }

    this.searchParams.set("sortBy", value);
  }

  deleteSortBy(): void {
    this.searchParams.delete("sortBy");
  }

  getSortDirection(): SortDir {
    const value = this.searchParams.get("sortDirection");
    if (value == null) {
      return DEFAULT_SORT_DIR;
    }

    return value as SortDir;
  }

  setSortDirection(value: SortDir): void {
    if (value === DEFAULT_SORT_DIR) {
      this.deleteSortDirection();
      return;
    }

    this.searchParams.set("sortDirection", value);
  }

  deleteSortDirection(): void {
    this.searchParams.delete("sortDirection");
  }

  toString(): string {
    return this.searchParams.toString();
  }

  clear(): void {
    const keys = Array.from(this.searchParams.keys());
    for (const key of keys) {
      this.searchParams.delete(key);
    }
  }

  private _nextSearchParamsToUrlSearchParams(
    searchParams: NextSearchParams,
  ): URLSearchParams {
    const urlSearchParams = new URLSearchParams();

    for (const paramName in searchParams) {
      const param = searchParams[paramName];
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
}

export default function useSearchParams(searchParams?: NextSearchParams) {
  return new SearchParams(searchParams ?? nextUseSearchParams());
}
