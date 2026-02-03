import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslations } from "next-intl";
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
        component="span"
        variant="body2"
        align="center"
        sx={{
          gridRow: { sm: 1 },
          color: "colors.lightBlack",
          fontSize: "0.75rem",
        }}
      >
        {label}
      </Typography>
      <IndicatorChart
        percentage={percentage}
        gradient={`conic-gradient(${theme.vars.palette.colors.lightGreen} ${percentage}%, #0000 0)`}
      />
      <Typography
        component="span"
        variant="subtitle2"
        sx={{
          gridRow: { sm: 3 },
          fontStyle: "italic",
          fontSize: "0.5rem",
        }}
      >
        {t("docCount", { count })}
      </Typography>
    </>
  );
}
