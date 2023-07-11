import { useTranslations } from "next-intl";
import { Grid, Paper, Typography } from "@/mui/material";
import { type SxProps } from "@mui/material";
import type { PaperProps } from "@mui/material/Paper";
import type { TypographyProps } from "@mui/material/Typography";
import UsageSelector from "./UsageSelector";
import type { ClientComponent, ServerComponent } from "@/types/next";

const DownloadForm: ServerComponent = () => {
  const t = useTranslations("download");

  return (
    <>
      <Typography component="h1" variant="h5" gutterBottom>
        {t("title")}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs>
          <Panel>
            <UsageSelector />
            <Typography variant="body2">
              Lorem ipsum dolor sit amet, officia excepteur ex fugiat
              reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit
              ex esse exercitation amet. Nisi anim cupidatat excepteur officia.
              Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet
              voluptate voluptate dolor minim nulla est proident. Nostrud
              officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex
              occaecat reprehenderit commodo officia dolor Lorem duis laboris
              cupidatat officia voluptate. Culpa proident adipisicing id nulla
              nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua
              reprehenderit commodo ex non excepteur duis sunt velit enim.
              Voluptate laboris sint cupidatat ullamco ut ea consectetur et est
              culpa et culpa duis.
            </Typography>
          </Panel>
        </Grid>

        <Grid item xs={3} container spacing={2} direction="column">
          <Grid item>
            <Panel>
              <Title>Gateway info</Title>
              <Typography variant="body2">
                Lorem ipsum dolor sit amet, officia excepteur ex fugiat
                reprehenderit enim labore culpa sint ad nisi Lorem pariatur
              </Typography>
            </Panel>
          </Grid>

          <Grid item>
            <Panel>
              <Title>{t("yourQueryTitle")}</Title>
              <Panel sx={{ bgcolor: "colors.white", p: 2, mb: 2 }}>
                <Typography variant="body2" sx={lineclamp(6)}>
                  Lorem ipsum dolor sit amet, officia excepteur ex fugiat
                  reprehenderit enim labore culpa sint ad nisi Lorem pariatur
                  mollit ex esse exercitation amet. Nisi anim cupidatat
                  excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem
                  est aliquip amet voluptate
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

function lineclamp(lines: number): SxProps {
  return {
    display: "-webkit-box",
    WebkitLineClamp: lines,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };
}

export default DownloadForm;
