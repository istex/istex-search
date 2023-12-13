import { useTranslations } from "next-intl";
import { Grid, Typography } from "@mui/material";
import Button from "@/components/Button";
import { examples } from "@/config";

const QueryExamplesList = ({
  goToResultsPage,
}: {
  goToResultsPage: (newQueryString: string) => void;
}) => {
  const tExamples = useTranslations("config.examples");
  const t = useTranslations(
    "home.SearchSection.SearchInput.RegularSearchInput",
  );

  return (
    <>
      <Typography variant="subtitle2" paragraph sx={{ mt: 2, mb: 1 }}>
        {t("examplesTitle")}
      </Typography>

      <Grid id="examples-grid" container rowSpacing={1} columnSpacing={2}>
        {Object.entries(examples).map(([name, _queryString]) => (
          <Grid key={name} item>
            <Button
              mainColor="white"
              secondaryColor="darkBlack"
              variant="text"
              size="small"
              onClick={() => {
                goToResultsPage(_queryString);
              }}
              sx={{ textTransform: "none" }}
            >
              {tExamples(name)}
            </Button>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default QueryExamplesList;
