import { useTranslations } from "next-intl";
import { Typography } from "@mui/material";
import type { ServerComponent } from "@/types/next";

const ResultsCount: ServerComponent<{ count: number }> = ({ count }) => {
  const t = useTranslations("results");

  return (
    <Typography variant="body2">{t.rich("resultsCount", { count })}</Typography>
  );
};

export default ResultsCount;
