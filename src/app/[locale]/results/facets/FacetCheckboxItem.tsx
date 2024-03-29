"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import IncludeIcon from "./IncludeIcon";
import type { ClientComponent } from "@/types/next";

interface FacetCheckboxItemProps {
  name: string;
  value: string;
  count: number;
  checked: boolean;
  excluded: boolean;
  disabled?: boolean;
  onChange: () => void;
}

const FacetCheckboxItem: ClientComponent<FacetCheckboxItemProps> = ({
  name,
  value,
  count,
  checked,
  excluded,
  disabled,
  onChange,
}) => {
  const t = useTranslations("results");
  const locale = useLocale();
  const [checkedFacet, setCheckedFacet] = useState<boolean>(
    checked || excluded,
  );

  return (
    <FormControlLabel
      data-testid="facet-checkbox-item"
      disabled={disabled}
      title={disabled === true ? t("unavailableTitle") : ""}
      sx={{
        marginLeft: 0,
        "& .MuiFormControlLabel-label": {
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        },
      }}
      control={
        <Checkbox
          id={name}
          checked={checkedFacet}
          onChange={() => {
            setCheckedFacet(!checkedFacet);
            onChange();
          }}
          size="small"
          color={excluded ? "error" : "primary"}
          checkedIcon={<IncludeIcon />}
          sx={{
            p: 0.5,
          }}
        />
      }
      label={
        <Box
          display="grid"
          gridTemplateColumns="auto auto"
          justifyContent="space-between"
          flexGrow={1}
          color={checked ? "primary.main" : excluded ? "error.main" : undefined}
        >
          <Typography
            component="span"
            variant="body2"
            sx={{
              fontWeight: checked || excluded ? 700 : 400,
              textOverflow: "ellipsis",
              OTextOverflow: "ellipsis" /* Opera < 10 */,
              overflow: "hidden",
              whiteSpace: "nowrap",
              mr: 1,
            }}
          >
            {value}
          </Typography>
          <Typography component="span" variant="body2">
            {count.toLocaleString(locale)}
          </Typography>
        </Box>
      }
    />
  );
};

export default FacetCheckboxItem;
