import { useTranslations } from "next-intl";
import { Grid, Typography } from "@mui/material";
import Button from "@/components/Button";
import { examples } from "@/config";
import { useQueryContext } from "@/contexts/QueryContext";
import CustomError from "@/lib/CustomError";
import type { ClientComponent } from "@/types/next";

interface ExamplesListProps {
  setError: (error: CustomError) => void;
}

const ExamplesList: ClientComponent<ExamplesListProps> = ({ setError }) => {
  const tExamples = useTranslations("config.examples");
  const t = useTranslations("home.SearchSection.RegularSearchInput");
  const { goToResultsPage } = useQueryContext();

  const handleClick = (queryString: string) => {
    goToResultsPage(queryString).catch((err: unknown) => {
      if (err instanceof CustomError) {
        setError(err);
      }
    });
  };

  return (
    <>
      <Typography variant="subtitle2" paragraph sx={{ mt: 2, mb: 1 }}>
        {t("examplesTitle")}
      </Typography>

      <Grid id="examples-grid" container rowSpacing={1} columnSpacing={2}>
        {Object.entries(examples).map(([name, queryString]) => (
          <Grid key={name} item>
            <Button
              mainColor="white"
              secondaryColor="darkBlack"
              size="small"
              onClick={() => {
                handleClick(queryString);
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
