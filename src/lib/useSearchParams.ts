import {
  ReadonlyURLSearchParams,
  useSearchParams as nextUseSearchParams,
} from "next/navigation";
import { type Usage, NO_FORMAT_SELECTED, usages } from "@/config";
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
    const value = this.searchParams.get("formats");
    const valueAsNumber = Number(value);
    if (value == null || Number.isNaN(valueAsNumber)) {
      return NO_FORMAT_SELECTED;
    }

    return valueAsNumber;
  }

  setFormats(value: number): void {
    if (value === NO_FORMAT_SELECTED) {
      this.searchParams.delete("formats");
      return;
    }

    this.searchParams.set("formats", value.toString());
  }

  getUsage(): Usage["name"] {
    const value = this.searchParams.get("usage");
    const usage = usages.find(({ name }) => name === value);
    if (value == null || usage == null) {
      return usages[0].name;
    }

    return usage.name;
  }

  setUsage(value: Usage["name"]): void {
    if (value === usages[0].name) {
      this.searchParams.delete("usage");
      return;
    }

    this.searchParams.set("usage", value);
  }

  toString(): string {
    return this.searchParams.toString();
  }

  private _nextSearchParamsToUrlSearchParams(
    searchParams: NextSearchParams
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
