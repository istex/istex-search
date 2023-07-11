import { useTranslations } from "next-intl";
import { Grid, Paper, Typography } from "@/mui/material";
import type { PaperProps } from "@mui/material/Paper";
import UsageSelector from "./UsageSelector";
import type { ClientComponent, ServerComponent } from "@/types/next";

const Panel: ClientComponent<Omit<PaperProps, "elevation" | "sx">> = (
  props
) => <Paper elevation={0} sx={{ p: 2 }} {...props} />;

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
          <Grid item xs>
            <Panel>
              <strong>Gateway info</strong>
              <br />
              <Typography variant="body2">
                Lorem ipsum dolor sit amet, officia excepteur ex fugiat
                reprehenderit enim labore culpa sint ad nisi Lorem pariatur
              </Typography>
            </Panel>
          </Grid>
          <Grid item xs>
            <Panel>
              <strong>Query info</strong>
              <br />
              <Typography variant="body2">
                Lorem ipsum dolor sit amet, officia excepteur ex fugiat
                reprehenderit enim labore culpa sint ad nisi Lorem pariatur
                mollit ex esse exercitation amet. Nisi anim cupidatat excepteur
                officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip
                amet voluptate
              </Typography>
            </Panel>
          </Grid>
        </Grid>
        <Grid item xs={3}>
          <Panel>
            <strong>Document list</strong>
            <br />
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
      </Grid>
    </>
  );
};

export default DownloadForm;
