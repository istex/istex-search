import { ReadonlyURLSearchParams } from "next/navigation";
import { md5 } from "js-md5";
import CustomError from "./CustomError";
import { getEmptyAst, type AST } from "./ast";
import { buildExtractParamsFromFormats, parseExtractParams } from "./formats";
import { clamp, closest, isValidMd5 } from "./utils";
import {
  DEFAULT_ARCHIVE_TYPE,
  DEFAULT_COMPRESSION_LEVEL,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_DIR,
  DEFAULT_USAGE_NAME,
  MIN_PER_PAGE,
  NO_FORMAT_SELECTED,
  SEARCH_MODE_REGULAR,
  compressionLevels,
  istexApiConfig,
  perPageOptions,
  rankValues,
  searchModes,
  sortDir,
  sortFields,
  usages,
  type ArchiveType,
  type CompressionLevel,
  type PerPageOption,
  type SearchMode,
  type SortBy,
  type SortDir,
  type UsageName,
} from "@/config";
import type { NextSearchParams } from "@/types/next";

// Wrapper class around URLSearchParams with stricter getters and setters
export default class SearchParams {
  private readonly searchParams: URLSearchParams;

  constructor(
    searchParams: ReadonlyURLSearchParams | NextSearchParams | string,
  ) {
    this.searchParams =
      searchParams instanceof ReadonlyURLSearchParams ||
      typeof searchParams === "string"
        ? new URLSearchParams(searchParams.toString())
        : this._nextSearchParamsToUrlSearchParams(searchParams);
  }

  async getQueryString(): Promise<string> {
    const queryString = this.searchParams.get("q")?.trim();
    const qId = this.searchParams.get("q_id");
    const isQueryStringPresent = queryString != null && queryString !== "";
    const isQIdPresent = qId != null;

    if (isQueryStringPresent) {
      return queryString;
    }

    if (isQIdPresent) {
      if (!isValidMd5(qId)) {
        throw new CustomError({ name: "QIdNotFoundError", qId });
      }

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

  getFilters(): AST {
    const base64Ast = this.searchParams.get("filters");
    if (base64Ast === null) {
      return [];
    }

    try {
      return JSON.parse(atob(base64Ast)) as AST;
    } catch (_err) {
      return [];
    }
  }

  setFilters(filters: AST): void {
    const base64Ast = btoa(JSON.stringify(filters));
    this.searchParams.set("filters", base64Ast);
  }

  deleteFilters(): void {
    this.searchParams.delete("filters");
  }

  getSearchMode(): SearchMode {
    const value = this.searchParams.get("searchMode");
    if (value == null) {
      return SEARCH_MODE_REGULAR;
    }

    if (!searchModes.includes(value)) {
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
    const jsonAst = this.searchParams.get("ast");
    if (jsonAst === null) {
      return getEmptyAst();
    }

    try {
      return JSON.parse(jsonAst) as AST;
    } catch (_err) {
      return getEmptyAst();
    }
  }

  setAst(ast: AST): void {
    this.searchParams.set("ast", JSON.stringify(ast));
  }

  deleteAst(): void {
    this.searchParams.delete("ast");
  }

  getSortBy(): SortBy {
    const value = this.searchParams.get("sortBy");
    if (value == null) {
      return DEFAULT_SORT_BY;
    }

    if (!rankValues.includes(value) && !sortFields.includes(value)) {
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

    if (!sortDir.includes(value)) {
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

  getRandomSeed(): string | undefined {
    return this.searchParams.get("randomSeed") ?? undefined;
  }

  setRandomSeed(value: string): void {
    if (value === "") {
      this.searchParams.delete("randomSeed");
    }

    this.searchParams.set("randomSeed", value);
  }

  deleteRandomSeed(): void {
    this.searchParams.delete("randomSeed");
  }

  getArchiveType(): ArchiveType {
    const allowedValues = usages[this.getUsageName()].archiveTypes;
    const defaultValue = allowedValues[0];
    const value = this.searchParams.get("archiveType");

    if (value == null || !allowedValues.includes(value)) {
      return defaultValue;
    }

    return value as ArchiveType;
  }

  setArchiveType(value: ArchiveType): void {
    if (value === DEFAULT_ARCHIVE_TYPE) {
      this.searchParams.delete("archiveType");
      return;
    }

    this.searchParams.set("archiveType", value);
  }

  deleteArchiveType(): void {
    this.searchParams.delete("archiveType");
  }

  getCompressionLevel(): CompressionLevel {
    const value = this.searchParams.get("compressionLevel");
    const valueAsNumber = Number(value);
    if (value == null || Number.isNaN(valueAsNumber)) {
      return DEFAULT_COMPRESSION_LEVEL;
    }

    if (!compressionLevels.includes(valueAsNumber)) {
      return DEFAULT_COMPRESSION_LEVEL;
    }

    return valueAsNumber as CompressionLevel;
  }

  setCompressionLevel(value: CompressionLevel): void {
    if (value === DEFAULT_COMPRESSION_LEVEL) {
      this.searchParams.delete("compressionLevel");
      return;
    }

    this.searchParams.set("compressionLevel", value.toString());
  }

  deleteCompressionLevel(): void {
    this.searchParams.delete("compressionLevel");
  }

  toString(): string {
    return this.searchParams.toString();
  }

  toJSON(): string {
    return this.searchParams.toString();
  }

  toNative(): URLSearchParams {
    return this.searchParams;
  }

  [Symbol.iterator]() {
    return this.searchParams.entries();
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
