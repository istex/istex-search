import { useTranslations } from "next-intl";
import { Grid, Link, Typography } from "@mui/material";
import { useDocumentContext } from "../Document/DocumentContext";
import HighlightedUrl from "../components/HighlightedUrl";
import Panel from "./Panel";
import PanelTitle from "./PanelTitle";
import { usages } from "@/config";
import { useQueryContext } from "@/contexts/QueryContext";
import { externalLink } from "@/i18n/i18n";
import { buildResultPreviewUrl, createCompleteQuery } from "@/lib/istexApi";
import useSearchParams from "@/lib/useSearchParams";
import { lineclamp } from "@/lib/utils";
import type { ServerComponent } from "@/types/next";

const InfoPanels: ServerComponent = () => {
  const t = useTranslations("download.InfoPanels");
  const tUsages = useTranslations("config.usages");
  const searchParams = useSearchParams();
  const { queryString } = useQueryContext();
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
  });

  return (
    <>
      <Grid item>
        <Panel>
          <PanelTitle>{tUsages(`${currentUsageName}.label`)}</PanelTitle>
          <Typography variant="body2" gutterBottom>
            {tUsages.rich(`${currentUsageName}.description`, links)}
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
          <Panel sx={{ bgcolor: "colors.white", p: 2, mb: 2 }}>
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
          <Panel sx={{ bgcolor: "colors.white", p: 2 }}>
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

const links = {
  inistLink: externalLink("https://www.inist.fr/"),
  wsLink: externalLink("https://services.istex.fr/category/services/"),
  lisisLink: externalLink("http://umr-lisis.fr/"),
  ifrisLink: externalLink("https://ifris.org"),
  inraeLink: externalLink("https://www.inrae.fr/"),
  iscpifLink: externalLink("https://iscpif.fr/"),
};

export default InfoPanels;
