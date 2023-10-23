import {
  ReadonlyURLSearchParams,
  useSearchParams as nextUseSearchParams,
} from "next/navigation";
import { buildExtractParamsFromFormats, parseExtractParams } from "./formats";
import { clamp, closest } from "./utils";
import {
  type UsageName,
  NO_FORMAT_SELECTED,
  DEFAULT_USAGE_NAME,
  usages,
  istexApiConfig,
  MIN_PER_PAGE,
  perPageOptions,
  type PerPageOption,
} from "@/config";
import { type NextSearchParams } from "@/types/next";

// Wrapper class around URLSearchParams with stricter getters and setters
class SearchParams {
  private readonly searchParams: URLSearchParams;

  constructor(searchParams: ReadonlyURLSearchParams | NextSearchParams) {
    this.searchParams =
      searchParams instanceof ReadonlyURLSearchParams
        ? new URLSearchParams(searchParams.toString())
        : this._nextSearchParamsToUrlSearchParams(searchParams);
  }

  getQueryString(): string {
    const value = this.searchParams.get("q");
    if (value == null || value === "") {
      return "";
    }

    return value;
  }

  setQueryString(value: string): void {
    if (value === "") {
      this.deleteQueryString();
      return;
    }

    this.searchParams.set("q", value);
  }

  deleteQueryString(): void {
    this.searchParams.delete("q");
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
