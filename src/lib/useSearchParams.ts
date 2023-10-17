import {
  ReadonlyURLSearchParams,
  useSearchParams as nextUseSearchParams,
} from "next/navigation";
import { buildExtractParamsFromFormats, parseExtractParams } from "./formats";
import { clamp } from "./utils";
import {
  type UsageName,
  NO_FORMAT_SELECTED,
  DEFAULT_USAGE_NAME,
  usages,
  istexApiConfig,
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

    return clamp(valueAsNumber, 0, istexApiConfig.maxSize);
  }

  setSize(value: number): void {
    if (value === 0) {
      this.deleteSize();
      return;
    }

    this.searchParams.set(
      "size",
      clamp(value, 0, istexApiConfig.maxSize).toString(),
    );
  }

  deleteSize(): void {
    this.searchParams.delete("size");
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
