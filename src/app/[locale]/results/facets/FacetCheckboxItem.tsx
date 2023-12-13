"use client";

import { useLocale } from "next-intl";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import IncludeIcon from "./IncludeIcon";
import type { ClientComponent } from "@/types/next";

const FacetCheckboxItem: ClientComponent<{
  value: string;
  count: number;
  checked?: boolean;
  onChange: () => void;
}> = ({ value, count, checked, onChange }) => {
  const locale = useLocale();

  return (
    <FormControlLabel
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
          checked={checked ?? false}
          onChange={onChange}
          size="small"
          color="primary"
          checkedIcon={<IncludeIcon />}
          sx={{
            p: 0.5,
          }}
        />
      }
      label={
        <Box
          display="inline-flex"
          justifyContent="space-between"
          flexGrow={1}
          color={checked === true ? "primary.main" : "text.primary"}
        >
          <Typography
            component="span"
            variant="body2"
            sx={{
              fontWeight: checked === true ? 700 : 400,
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