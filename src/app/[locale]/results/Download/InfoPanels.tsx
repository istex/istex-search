import { useTranslations } from "next-intl";
import { Grid, Link, Typography, type SxProps } from "@mui/material";
import HighlightedUrl from "../components/HighlightedUrl";
import Panel from "./Panel";
import PanelTitle from "./PanelTitle";
import { usages } from "@/config";
import { useDocumentContext } from "@/contexts/DocumentContext";
import { useQueryContext } from "@/contexts/QueryContext";
import { buildResultPreviewUrl, createCompleteQuery } from "@/lib/istexApi";
import { useSearchParams } from "@/lib/hooks";
import { lineclamp } from "@/lib/utils";
import type { ServerComponent } from "@/types/next";

const panelStyles: SxProps = {
  "&.MuiPaper-root": {
    bgcolor: "colors.white",
  },
  p: 2,
};

const InfoPanels: ServerComponent = () => {
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

  return (
    <>
      <Grid item>
        <Panel>
          <PanelTitle>{tUsages(`${currentUsageName}.label`)}</PanelTitle>
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

      <Grid item>
        <Panel>
          <PanelTitle>{t("queryTitle")}</PanelTitle>
          <Panel
            sx={{
              ...panelStyles,
              mb: 2,
            }}
          >
            <Typography
              data-testid="query-string"
              variant="body2"
              sx={{ ...lineclamp(6), wordBreak: "break-word" }}
            >
              {createCompleteQuery(
                queryString,
                filters,
                selectedDocuments,
                excludedDocuments,
              )}
            </Typography>
          </Panel>

          <PanelTitle>{t("rawRequestTitle")}</PanelTitle>
          <Panel sx={panelStyles}>
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
};

export default InfoPanels;
