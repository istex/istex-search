"use client";

import { useTranslations } from "next-intl";
import { redirect } from "next-intl/server";
import { Divider, Grid, Link, Paper, Typography } from "@/mui/material";
import type { PaperProps } from "@mui/material/Paper";
import type { TypographyProps } from "@mui/material/Typography";
import FormatPicker from "./FormatPicker";
import UsageSelector from "./UsageSelector";
import { usages } from "@/config";
import useSearchParams from "@/lib/useSearchParams";
import { lineclamp } from "@/lib/utils";
import type { ClientComponent } from "@/types/next";

const DownloadForm: ClientComponent = () => {
  const t = useTranslations("download");
  const tUsages = useTranslations("config.usages");
  const searchParams = useSearchParams();
  const queryString = searchParams.getQueryString();
  const currentUsage = usages.find(
    ({ name }) => searchParams.getUsage() === name
  );

  if (queryString === "") {
    redirect("/");
  }

  return (
    <>
      <Typography component="h1" variant="h5" gutterBottom>
        {t("title")}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs>
          <Panel>
            <UsageSelector />
            <Divider sx={{ mt: 2, mb: 1 }} />
            <FormatPicker />
          </Panel>
        </Grid>

        <Grid item xs={4} container spacing={2} direction="column">
          {currentUsage != null && (
            <Grid item>
              <Panel>
                <Title>{tUsages(`${currentUsage.name}.label`)}</Title>
                <Typography variant="body2" gutterBottom>
                  {tUsages.rich(`${currentUsage.name}.description`, {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
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
          )}

          <Grid item>
            <Panel>
              <Title>{t("yourQueryTitle")}</Title>
              <Panel sx={{ bgcolor: "colors.white", p: 2, mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ ...lineclamp(6), wordBreak: "break-word" }}
                >
                  {queryString}
                </Typography>
              </Panel>

              <Title>{t("rawRequestTitle")}</Title>
              <Panel sx={{ bgcolor: "colors.white", p: 2 }}>
                <Typography variant="body2" sx={lineclamp(4)}>
                  Lorem ipsum dolor sit amet, officia excepteur ex fugiat
                  reprehenderit enim labore culpa sint ad nisi Lorem pariatur
                  mollit ex esse exercitation amet. Nisi anim cupidatat
                  excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem
                  est aliquip amet voluptate
                </Typography>
              </Panel>
            </Panel>
          </Grid>
        </Grid>
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

export default DownloadForm;
