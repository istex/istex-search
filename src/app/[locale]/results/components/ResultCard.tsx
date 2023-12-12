"use client";

import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { lighten } from "@mui/system/colorManipulator";
import { useDocumentContext } from "../Document/DocumentContext";
import type { Result } from "@/lib/istexApi";
import { lineclamp } from "@/lib/utils";
import { montserrat } from "@/mui/fonts";
import type { ClientComponent } from "@/types/next";

const ResultCard: ClientComponent<{ info: Result }> = ({ info }) => {
  const { displayDocument } = useDocumentContext();

  return (
    <Card
      variant="outlined"
      sx={(theme) => ({
        height: "100%",
        bgcolor: lighten(theme.palette.colors.blue, 0.95),
        borderColor: "colors.blue",
      })}
    >
      <CardActionArea
        onClick={() => {
          displayDocument(info.id);
        }}
        sx={{
          height: "100%",
        }}
      >
        <CardContent
          sx={{
            height: "100%",
          }}
        >
          <Typography
            component="div"
            sx={{
              fontFamily: montserrat.style.fontFamily,
              fontWeight: "bold",
              fontSize: "1.1rem",
              lineHeight: 1.4,
              ...lineclamp(3),
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
            variant="body2"
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
              fontSize: "0.8rem",
              color: "colors.grey",
              maxHeight: "10em",
              ...lineclamp(6),
            }}
          >
            {info.abstract}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ResultCard;
