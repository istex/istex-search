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
