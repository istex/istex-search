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
      this.searchParams.delete("q");
      return;
    }

    this.searchParams.set("q", value);
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
      this.searchParams.delete("extract");
      return;
    }

    this.searchParams.set("extract", buildExtractParamsFromFormats(value));
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
      this.searchParams.delete("usage");
      return;
    }

    this.searchParams.set("usage", value);
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
      this.searchParams.delete("size");
      return;
    }

    this.searchParams.set(
      "size",
      clamp(value, 0, istexApiConfig.maxSize).toString(),
    );
  }

  toString(): string {
    return this.searchParams.toString();
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
