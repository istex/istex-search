import { useTranslations } from "next-intl";
import { Grid, Typography } from "@mui/material";
import Button from "@/components/Button";
import { examples } from "@/config";
import { useQueryContext } from "@/contexts/QueryContext";
import type CustomError from "@/lib/CustomError";
import type { ClientComponent } from "@/types/next";

interface ExamplesListProps {
  setError: (error: CustomError) => void;
}

const ExamplesList: ClientComponent<ExamplesListProps> = ({ setError }) => {
  const tExamples = useTranslations("config.examples");
  const t = useTranslations(
    "home.SearchSection.SearchInput.RegularSearchInput",
  );
  const { goToResultsPage } = useQueryContext();

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
              size="small"
              onClick={() => {
                goToResultsPage(_queryString).catch(setError);
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

export default ExamplesList;
