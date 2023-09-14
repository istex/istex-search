import { useTranslations } from "next-intl";
import { Typography } from "@mui/material";
import type { ClientComponent } from "@/types/next";

const ResultsCount: ClientComponent<{ count: number }> = ({ count }) => {
  const t = useTranslations("results");

  return (
    <Typography variant="body2">
      {t.rich("resultsCount", {
        count,
        strong: (chunks) => <strong>{chunks}</strong>,
      })}
    </Typography>
  );
};

export default ResultsCount;
