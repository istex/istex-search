import { useTranslations } from "next-intl";
import { Grid, Link, Paper, Typography } from "@mui/material";
import type { PaperProps } from "@mui/material/Paper";
import type { TypographyProps } from "@mui/material/Typography";
import { usages } from "@/config";
import { buildResultPreviewUrl } from "@/lib/istexApi";
import useSearchParams from "@/lib/useSearchParams";
import { lineclamp } from "@/lib/utils";
import type { ClientComponent } from "@/types/next";

const InfoPanels: ClientComponent = () => {
  const t = useTranslations("download.InfoPanels");
  const tUsages = useTranslations("config.usages");
  const searchParams = useSearchParams();
  const queryString = searchParams.getQueryString();
  const currentUsageName = searchParams.getUsageName();
  const currentUsage = usages[currentUsageName];
  const resultsApiUrl = buildResultPreviewUrl({
    queryString,
  }).toString();

  return (
    <>
      <Grid item>
        <Panel>
          <Title>{tUsages(`${currentUsageName}.label`)}</Title>
          <Typography
            data-testid={`${currentUsageName}-usage-description`}
            variant="body2"
            gutterBottom
          >
            {tUsages.rich(`${currentUsageName}.description`)}
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
          <Title>{t("queryTitle")}</Title>
          <Panel sx={{ bgcolor: "colors.white", p: 2, mb: 2 }}>
            <Typography
              data-testid="query-string"
              variant="body2"
              sx={{ ...lineclamp(6), wordBreak: "break-word" }}
            >
              {queryString}
            </Typography>
          </Panel>

          <Title>{t("rawRequestTitle")}</Title>
          <Panel sx={{ bgcolor: "colors.white", p: 2 }}>
            <Typography
              data-testid="raw-request"
              variant="body2"
              component={Link}
              href={resultsApiUrl}
              target="_blank"
              rel="noreferrer"
              sx={{ ...lineclamp(4), wordBreak: "break-word" }}
            >
              {resultsApiUrl}
            </Typography>
          </Panel>
        </Panel>
      </Grid>
    </>
  );
};

const Title: ClientComponent<
  Omit<
    TypographyProps & { component?: React.ElementType },
    "variant" | "gutterBottom" | "color" | "fontSize"
  >
> = (props) => (
  <Typography
    component="h2"
    variant="h6"
    gutterBottom
    color="primary"
    fontSize="0.875rem"
    {...props}
  />
);

const Panel: ClientComponent<Omit<PaperProps, "elevation">> = (props) => (
  <Paper elevation={0} sx={{ p: 2 }} {...props} />
);

export default InfoPanels;
