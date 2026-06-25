"use server";

import type { CustomErrorInfo } from "@/lib/CustomError";

type TextLuceneResponse = {
  value: string;
}[];

export type ActionResult =
  | { success: false; errorInfo: CustomErrorInfo }
  | { success: true; value: string };

export async function getQueryStringFromPrompt(
  prompt: string,
): Promise<ActionResult> {
  const url = new URL(
    "/v1/istex-search",
    "https://text-lucene.services.istex.fr",
  );
  url.searchParams.set("sid", "istex-search");

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      body: JSON.stringify([{ value: prompt }]),
    });
  } catch (_error) {
    return { success: false, errorInfo: { name: "TextLuceneError" } };
  }

  if (!response.ok) {
    return { success: false, errorInfo: { name: "TextLuceneError" } };
  }

  const body = (await response.json()) as TextLuceneResponse;
  if (body.length === 0 || !("value" in body[0])) {
    return { success: false, errorInfo: { name: "TextLuceneError" } };
  }

  const queryString = body[0].value;
  if (queryString === "") {
    return {
      success: false,
      errorInfo: { name: "TextLuceneEmptyResponseError" },
    };
  }

  return { success: true, value: queryString };
}
