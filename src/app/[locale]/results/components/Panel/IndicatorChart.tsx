import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface IndicatorChartProps {
  percentage: number;
  gradient: string;
}

const CHART_SIZE = 60;
const CIRCLE_WIDTH = 10;

export default function IndicatorChart({
  percentage,
  gradient,
}: IndicatorChartProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        gridRow: { sm: 2 },
        width: CHART_SIZE - CIRCLE_WIDTH,
        height: CHART_SIZE - CIRCLE_WIDTH,
        margin: `${CIRCLE_WIDTH / 2}px`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "colors.lightGreen",
        fontWeight: 700,
        borderRadius: "100%",
        border: `${CIRCLE_WIDTH / 2}px solid`,
        borderColor: theme.alpha(theme.vars.palette.colors.lightGreen, 0.2),
        position: "relative",
        fontSize: "0.8rem",
      }}
    >
      {`${percentage}\u00A0%`}
      <Box
        component="div"
        sx={{
          position: "absolute",
          width: CHART_SIZE,
          height: CHART_SIZE,

          "&:before": {
            content: "''",
            position: "absolute",
            inset: 0,
            borderRadius: "100%",
            background: gradient,
            WebkitMask: `radial-gradient(farthest-side,#0000 ${
              (CHART_SIZE - CIRCLE_WIDTH * 2) / 2
            }px,#000 ${(CHART_SIZE - CIRCLE_WIDTH * 2) / 2}px)`,
            mask: `radial-gradient(farthest-side,#0000 ${
              (CHART_SIZE - CIRCLE_WIDTH * 2) / 2
            }px,#000 ${(CHART_SIZE - CIRCLE_WIDTH * 2) / 2}px)`,
          },
        }}
      />
    </Box>
  );
}
