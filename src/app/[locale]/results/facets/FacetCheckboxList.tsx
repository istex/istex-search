"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { Autocomplete, Box, IconButton, TextField } from "@mui/material";
import FacetCheckboxItem from "./FacetCheckboxItem";
import { useFacetContext, type FacetItem } from "./FacetContext";
import { ASC, DESC } from "./constants";
import type { ClientComponent } from "@/types/next";

const FacetCheckboxList: ClientComponent<{
  facetTitle: string;
  facetItems: FacetItem[];
}> = ({ facetTitle, facetItems }) => {
  const t = useTranslations("results.Facets");

  const { toggleFacet } = useFacetContext();

  const [displayedFacets, setDisplayedFacets] = useState(facetItems);
  const [searchFacetItem, setSearchFacetItem] = useState<FacetItem[]>([]);

  const handleSort = (
    field: "key" | "docCount",
    order: typeof ASC | typeof DESC,
  ) => {
    const sortedFacets = [...displayedFacets].sort((a, b) => {
      switch (field) {
        case "key":
          if (order === ASC) {
            return a[field].localeCompare(b[field]);
          } else {
            return b[field].localeCompare(a[field]);
          }
        case "docCount":
          if (order === ASC) {
            return a[field] - b[field];
          } else {
            return b[field] - a[field];
          }
        default:
          return 0;
      }
    });
    setDisplayedFacets(sortedFacets);
  };

  return (
    <>
      <Autocomplete
        options={[...displayedFacets].sort((a, b) =>
          a.key.localeCompare(b.key),
        )}
        multiple
        disableCloseOnSelect
        size="small"
        fullWidth
        getOptionLabel={(option) => option.key}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="filled"
            label={t(`${facetTitle}.inputPlaceholder`)}
            InputLabelProps={{
              sx: {
                fontSize: "0.8rem",
              },
            }}
            InputProps={{
              ...params.InputProps,
              sx: {
                fontSize: "0.8rem",
              },
            }}
          />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option.key}>
            {option.key}
          </li>
        )}
        onChange={(event, newValue) => {
          setSearchFacetItem(newValue);
        }}
      />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        py={0.5}
      >
        <Box display="flex" alignItems="center" gap={0.5}>
          <IconButton
            title={t("sortAsc")}
            aria-label={t("sortAsc")}
            onClick={() => {
              handleSort("key", ASC);
            }}
            size="small"
          >
            <ArrowDropUpIcon />
          </IconButton>
          <IconButton
            title={t("sortDesc")}
            aria-label={t("sortDesc")}
            onClick={() => {
              handleSort("key", DESC);
            }}
            size="small"
          >
            <ArrowDropDownIcon />
          </IconButton>
        </Box>
        <Box display="flex" alignItems="center" gap={0.5}>
          <IconButton
            title={t("sortAsc")}
            aria-label={t("sortAsc")}
            onClick={() => {
              handleSort("docCount", ASC);
            }}
            size="small"
          >
            <ArrowDropUpIcon />
          </IconButton>
          <IconButton
            title={t("sortDesc")}
            aria-label={t("sortDesc")}
            onClick={() => {
              handleSort("docCount", DESC);
            }}
            size="small"
          >
            <ArrowDropDownIcon />
          </IconButton>
        </Box>
      </Box>
      <Box
        maxHeight={140}
        display="flex"
        flexDirection="column"
        overflow="auto"
      >
        {displayedFacets
          .filter((facetItem) => {
            if (searchFacetItem.length === 0) {
              return true;
            }
            return searchFacetItem.includes(facetItem);
          })
          .map((facetItem) => (
            <FacetCheckboxItem
              key={facetItem.key}
              value={facetItem.key}
              count={facetItem.docCount}
              checked={facetItem.selected}
              onChange={() => {
                toggleFacet(facetTitle, facetItem.key);
              }}
            />
          ))}
      </Box>
    </>
  );
};

export default FacetCheckboxList;
