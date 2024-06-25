import { useTranslations } from "next-intl";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import IndicatorChart from "./IndicatorChart";

interface IndicatorProps {
  label: string;
  count: number;
  total: number;
}

export default function Indicator({ label, count, total }: IndicatorProps) {
  const t = useTranslations("results.Panel");
  const percentage = total > 0 ? Math.round((count * 100) / total) : 0;
  const theme = useTheme();

  return (
    <>
      <Typography
        variant="body2"
        align="center"
        gridRow={{ sm: 1 }}
        sx={{
          color: "colors.lightBlack",
          fontSize: "0.75rem",
        }}
      >
        {label}
      </Typography>
      <IndicatorChart
        percentage={percentage}
        gradient={`conic-gradient(${theme.palette.colors.lightGreen} ${percentage}%, #0000 0)`}
      />
      <Typography
        variant="subtitle2"
        gridRow={{ sm: 3 }}
        paragraph
        sx={{
          fontStyle: "italic",
          fontSize: "0.5rem",
        }}
      >
        {t("docCount", { count })}
      </Typography>
    </>
  );
}
