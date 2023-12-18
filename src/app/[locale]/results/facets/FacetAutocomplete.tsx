"use client";

import { useTranslations } from "next-intl";
import {
  Autocomplete,
  Chip,
  InputBase,
  InputLabel,
  ListItem,
} from "@mui/material";
import { useFacetContext } from "./FacetContext";
import type { FacetLayoutProps } from "./FacetLayout";
import type { ClientComponent } from "@/types/next";

const FacetAutocomplete: ClientComponent<FacetLayoutProps> = ({
  facetTitle,
  facetItems,
}) => {
  const { toggleFacet, clearOneFacet } = useFacetContext();
  const t = useTranslations(`results.Facets.${facetTitle}`);

  return (
    <Autocomplete
      options={facetItems.sort((a, b) => a.key.localeCompare(b.key))}
      value={facetItems.filter((facetItem) => facetItem.selected)}
      multiple
      disableCloseOnSelect
      size="small"
      getOptionLabel={(option) => option.key}
      renderInput={(params) => {
        const { InputLabelProps, InputProps, ...rest } = params;
        return (
          <>
            <InputLabel
              htmlFor={`${facetTitle}-autocomplete`}
              sx={{
                color: "colors.lightBlack",
                fontSize: "0.8rem",
                mb: 0.5,
              }}
            >
              {t("inputLabel")}
            </InputLabel>
            <InputBase
              {...params.InputProps}
              {...rest}
              fullWidth
              placeholder={t("inputPlaceholder")}
              sx={{
                fontSize: "0.8rem",
                backgroundColor: "common.white",
                borderRadius: 1,
                padding: "5px 10px",
              }}
              inputProps={{
                ...params.inputProps,
                id: `${facetTitle}-autocomplete`,
              }}
            />
          </>
        );
      }}
      ListboxProps={{
        sx: {
          "& .MuiAutocomplete-option": {
            justifyContent: "space-between",
          },
        },
      }}
      renderOption={(props, option) => (
        <ListItem {...props} key={option.key}>
          <span>{option.key}</span>
          <span>({option.docCount})</span>
        </ListItem>
      )}
      renderTags={(tagValue, getTagProps) => {
        return tagValue.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            key={option.key}
            label={`${option.key} (${option.docCount})`}
          />
        ));
      }}
      onChange={(e, value, reason, details) => {
        if (reason === "clear") {
          clearOneFacet(facetTitle);
          return;
        }
        if (reason === "removeOption" || reason === "selectOption") {
          toggleFacet(facetTitle, details?.option.key);
        }
      }}
    />
  );
};

export default FacetAutocomplete;
