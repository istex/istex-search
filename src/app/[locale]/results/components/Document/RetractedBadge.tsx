import { Chip } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import type * as React from "react";

interface RetractedBadgeProps {
  doi: string;
}

export default function RetractedBadge({ doi }: RetractedBadgeProps) {
  const t = useTranslations("results.Document.RetractedBadge");
  const { data, isLoading } = useQuery({
    queryKey: ["retracted-state", doi],
    queryFn: async () => await getRetractedState(doi),
  });

  const preventClickPropagation: React.MouseEventHandler = (event) => {
    event.stopPropagation();
  };

  // If the web service hasn't responded yet, don't display anything
  if (isLoading || data == null || data[0] == null) {
    return null;
  }

  // If the document isn't retracted, don't display anything
  if (!data[0].value.is_retracted) {
    return null;
  }

  return (
    <Chip
      label={t("label")}
      component="a"
      href="https://services.istex.fr/art-retracte-istex/"
      target="_blank"
      rel="noreferrer"
      onClick={preventClickPropagation}
      sx={(theme) => ({
        fontWeight: "bold",
        width: "fit-content",
        height: "1.5rem",
        bgcolor: alpha(theme.palette.error.main, 0.5),
        color: theme.vars.palette.error.dark,
        borderRadius: "3px",
        "& .MuiChip-label": {
          px: 1,
        },
        ":hover, &.Mui-focusVisible": {
          bgcolor: alpha(theme.palette.error.main, 0.8),
        },
      })}
    />
  );
}

type BibCheckIsRetractedResponse = {
  value: {
    is_retracted: boolean;
  };
}[];

async function getRetractedState(doi: string) {
  const response = await fetch(
    "https://biblio-ref.services.istex.fr/v1/is-retracted",
    {
      method: "POST",
      body: JSON.stringify([{ value: doi }]),
    },
  );
  if (!response.ok) {
    console.error(response);
    throw new Error("Error from bibCheck web service");
  }

  return (await response.json()) as BibCheckIsRetractedResponse;
}
