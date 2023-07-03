"use client";

import { Card, CardContent, Typography } from "@/mui/material";
import { lighten } from "@mui/material/styles";
import type { ClientComponent } from "@/types/next";

export interface Result {
  id: string;
  title?: string;
  abstract?: string;
  author?: Array<{ name?: string }>;
  host?: {
    title?: string;
  };
}

const ResultCard: ClientComponent<{ info: Result }> = ({ info }) => (
  <Card
    variant="outlined"
    sx={(theme) => ({
      height: "100%",
      bgcolor: lighten(theme.palette.colors.blue, 0.95),
      borderColor: "colors.blue",
    })}
  >
    <CardContent>
      <Typography
        variant="h6"
        component="div"
        sx={{
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {info.title}
      </Typography>

      {info.host?.title != null && (
        <Typography
          variant="subtitle2"
          component="div"
          sx={{
            fontStyle: "italic",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: "colors.grey",
            mb: 1,
          }}
        >
          {info.host.title}
        </Typography>
      )}

      <Typography
        variant="body1"
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          mb: 2,
        }}
      >
        {info.author
          ?.filter(({ name }) => name)
          .map(({ name }) => name)
          .join(", ")}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          display: "-webkit-box",
          WebkitLineClamp: 6,
          WebkitBoxOrient: "vertical",
          maxHeight: "10em",
          overflow: "hidden",
          textOverflow: "ellipsis",
          color: "colors.grey",
        }}
      >
        {info.abstract}
      </Typography>
    </CardContent>
  </Card>
);

export default ResultCard;
