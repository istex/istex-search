import { useTranslations } from "next-intl";
import { Grid2 as Grid, Typography } from "@mui/material";
import Button from "@/components/Button";
import { examples } from "@/config";
import { useQueryContext } from "@/contexts/QueryContext";
import CustomError from "@/lib/CustomError";

interface ExamplesListProps {
  setError: (error: CustomError) => void;
}

export default function ExamplesList({ setError }: ExamplesListProps) {
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
      <Typography component="p" variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
        {t("examplesTitle")}
      </Typography>

      <Grid id="examples-grid" container rowSpacing={1} columnSpacing={2}>
        {Object.entries(examples).map(([name, queryString]) => (
          <Grid key={name}>
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
}
