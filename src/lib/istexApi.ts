import { buildExtractParamsFromFormats } from "./formats";
import { istexApiConfig } from "@/config";

interface BuildResultPreviewUrlOptions {
  queryString: string;
  size: number;
  fields: string[];
}

export function buildResultPreviewUrl({
  queryString,
  size,
  fields,
}: BuildResultPreviewUrlOptions) {
  const url = new URL("document", istexApiConfig.baseUrl);
  url.searchParams.set("q", queryString);
  url.searchParams.set("size", size.toString());
  url.searchParams.set("output", fields.join(","));
  url.searchParams.set("sid", "istex-dl");

  return url;
}

interface BuildFullApiUrlOptions {
  queryString: string;
  selectedFormats: number;
  size: number;
}

export function buildFullApiUrl({
  queryString,
  selectedFormats,
  size,
}: BuildFullApiUrlOptions) {
  const url = new URL("document", istexApiConfig.baseUrl);
  url.searchParams.set("q", queryString);
  url.searchParams.set("size", size.toString());
  url.searchParams.set("sid", "istex-dl");
  url.searchParams.set(
    "extract",
    buildExtractParamsFromFormats(selectedFormats)
  );

  return url;
}
