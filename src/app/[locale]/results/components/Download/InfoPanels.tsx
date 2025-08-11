import { useTranslations } from "next-intl";
import { Grid, Link, Typography } from "@mui/material";
import HighlightedUrl from "../HighlightedUrl";
import Panel, { PanelTitle } from "@/components/Panel";
import { usages } from "@/config";
import { useDocumentContext } from "@/contexts/DocumentContext";
import { useQueryContext } from "@/contexts/QueryContext";
import { useSearchParams } from "@/lib/hooks";
import { buildResultPreviewUrl } from "@/lib/istexApi";
import { lineclamp } from "@/lib/utils";

export default function InfoPanels() {
  const t = useTranslations("download.InfoPanels");
  const tUsages = useTranslations("config.usages");
  const searchParams = useSearchParams();
  const { queryString, randomSeed } = useQueryContext();
  const { selectedDocuments, excludedDocuments } = useDocumentContext();
  const perPage = searchParams.getPerPage();
  const page = searchParams.getPage();
  const filters = searchParams.getFilters();
  const sortBy = searchParams.getSortBy();
  const sortDir = searchParams.getSortDirection();
  const currentUsageName = searchParams.getUsageName();
  const currentUsage = usages[currentUsageName];
  const resultsApiUrl = buildResultPreviewUrl({
    queryString,
    perPage,
    page,
    filters,
    selectedDocuments,
    excludedDocuments,
    sortBy,
    sortDir,
    randomSeed,
  });
  const completeQuery = resultsApiUrl.searchParams.get("q") ?? "";

  // The complete query is potentially very long and is only displayed on a few lines anyway.
  // Since it can contain a list of identifiers that can be analyzed by browser extensions such
  // as Click & Read or Zotero, it's best to keep it short
  const truncatedCompleteQuery = `${completeQuery.slice(0, 512)}…`;

  return (
    <>
      <Grid>
        <Panel heading={tUsages(`${currentUsageName}.label`)}>
          <Typography variant="body2" gutterBottom>
            {tUsages(`${currentUsageName}.description`)}
          </Typography>
          <Link
            href={currentUsage.url}
            target="_blank"
            rel="noreferrer"
            sx={(theme) => ({
              fontSize: theme.typography.body2.fontSize,
              fontWeight: "bold",
            })}
          >
            {t("seeMoreLink")}
          </Link>
        </Panel>
      </Grid>

      <Grid>
        <Panel heading={t("queryTitle")}>
          <Panel
            sx={{
              "&&": {
                bgcolor: "colors.white",
              },
              mb: 2,
            }}
          >
            <Typography
              data-testid="query-string"
              variant="body2"
              title={truncatedCompleteQuery}
              sx={{ ...lineclamp(6), wordBreak: "break-word" }}
            >
              {truncatedCompleteQuery}
            </Typography>
          </Panel>

          <PanelTitle>{t("rawRequestTitle")}</PanelTitle>
          <Panel
            sx={{
              "&&": {
                bgcolor: "colors.white",
              },
            }}
          >
            <Typography
              data-testid="raw-request"
              variant="body2"
              component={Link}
              href={resultsApiUrl.toString()}
              target="_blank"
              rel="noreferrer"
              sx={{ ...lineclamp(4), wordBreak: "break-word" }}
            >
              <HighlightedUrl url={resultsApiUrl} />
            </Typography>
          </Panel>
        </Panel>
      </Grid>
    </>
  );
}
