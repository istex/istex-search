"use client";

import { Card, CardContent, Typography } from "@mui/material";
import { lighten } from "@mui/material/styles";
import type { Result } from "@/lib/istexApi";
import { lineclamp } from "@/lib/utils";
import type { ClientComponent } from "@/types/next";

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
      <Typography variant="h6" component="div" sx={lineclamp(3)}>
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
          ...lineclamp(6),
          color: "colors.grey",
          maxHeight: "10em",
        }}
      >
        {info.abstract}
      </Typography>
    </CardContent>
  </Card>
);

export default ResultCard;
