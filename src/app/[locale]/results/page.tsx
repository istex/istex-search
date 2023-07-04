import { getTranslations, redirect } from "next-intl/server";
import ResultsGrid from "./components/ResultsGrid";
import ResultCard, { type Result } from "./components/ResultCard";
import { buildResultPreviewUrl } from "@/lib/istexApi";
import type { GenerateMetadata, Page } from "@/types/next";

interface IstexApiResponse {
  total: number;
  hits: Result[];
}

async function getResults(queryString: string): Promise<IstexApiResponse> {
  const t = await getTranslations("results");

  // Create the URL
  const url = buildResultPreviewUrl({
    queryString,
    size: 10,
    fields: ["title", "host.title", "author", "abstract"],
  });

  // API call
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`API responded with a ${response.status} status code!`);
  }

  // Fill some missing fields with placeholder texts
  const body: IstexApiResponse = await response.json();
  body.hits.forEach((result) => {
    result.title ??= t("placeholders.noTitle");
    result.abstract ??= t("placeholders.noAbstract");
  });

  return body;
}

export const generateMetadata: GenerateMetadata = async () => {
  const t = await getTranslations("results.metadata");

  return {
    title: `Istex-DL - ${t("title")}`,
  };
};

const ResultsPage: Page = async ({ searchParams }) => {
  const queryString = Array.isArray(searchParams.q)
    ? searchParams.q[0]
    : searchParams.q;

  if (queryString == null) {
    redirect("/");
  }

  const results = await getResults(queryString);

  return (
    <ResultsGrid size={10} columns={2}>
      {results.hits.map((result) => (
        <ResultCard key={result.id} info={result} />
      ))}
    </ResultsGrid>
  );
};

export default ResultsPage;
