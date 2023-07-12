"use client";

import { type ChangeEvent, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
} from "@/mui/material";
import { formats } from "@/config";
import type { ClientComponent } from "@/types/next";

const FormatPicker: ClientComponent = () => {
  const t = useTranslations("config.formats");
  const [checked, setChecked] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setChecked(event.target.checked);
  };

  return (
    <Grid
      container
      spacing={2}
      sx={(theme) => ({
        display: "flex",
        fontSize: theme.typography.body2.fontSize,
      })}
    >
      <Grid item xs={4}>
        <FormControl component="fieldset" variant="standard">
          <FormControlLabel
            label={t("fulltext.category")}
            disableTypography
            control={
              <Checkbox
                checked={checked}
                indeterminate={checked}
                onChange={handleChange}
              />
            }
          />
          <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
            {Object.entries(formats.fulltext).map(([formatName]) => (
              <FormControlLabel
                key={formatName}
                label={t(`fulltext.${formatName}`)}
                disableTypography
                control={<Checkbox checked={checked} onChange={handleChange} />}
              />
            ))}
          </Box>
        </FormControl>
      </Grid>

      <Grid item xs={4} container>
        <Grid item xs={12}>
          <FormControl component="fieldset" variant="standard">
            <FormControlLabel
              label={t("metadata.category")}
              disableTypography
              control={
                <Checkbox
                  checked={checked}
                  indeterminate={checked}
                  onChange={handleChange}
                />
              }
            />
            <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
              {Object.entries(formats.metadata).map(([formatName]) => (
                <FormControlLabel
                  key={formatName}
                  label={t(`metadata.${formatName}`)}
                  disableTypography
                  control={
                    <Checkbox checked={checked} onChange={handleChange} />
                  }
                />
              ))}
            </Box>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            label={t("annexes")}
            disableTypography
            control={<Checkbox checked={checked} onChange={handleChange} />}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            label={t("covers")}
            disableTypography
            control={<Checkbox checked={checked} onChange={handleChange} />}
          />
        </Grid>
      </Grid>

      <Grid item xs={4}>
        <FormControl component="fieldset" variant="standard">
          <FormControlLabel
            label={t("enrichments.category")}
            disableTypography
            control={
              <Checkbox
                checked={checked}
                indeterminate={checked}
                onChange={handleChange}
              />
            }
          />
          <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
            {Object.entries(formats.enrichments).map(([formatName]) => (
              <FormControlLabel
                key={formatName}
                label={t(`enrichments.${formatName}`)}
                disableTypography
                control={<Checkbox checked={checked} onChange={handleChange} />}
              />
            ))}
          </Box>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default FormatPicker;
