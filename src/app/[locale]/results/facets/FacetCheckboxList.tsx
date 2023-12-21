"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { Box, IconButton, InputAdornment, InputBase } from "@mui/material";
import FacetCheckboxItem from "./FacetCheckboxItem";
import { useFacetContext, type FacetItem } from "./FacetContext";
import type { FacetLayoutProps } from "./FacetLayout";
import { sortFacets } from "./utils";
import type { ClientComponent } from "@/types/next";

export const ASC = "asc";
export const DESC = "desc";

export const KEY = "key";
export const DOC_COUNT = "docCount";

export type SortOrder = typeof ASC | typeof DESC;
export type SortField = typeof KEY | typeof DOC_COUNT;

const FacetCheckboxList: ClientComponent<FacetLayoutProps> = ({
  facetTitle,
  facetItems,
}) => {
  const t = useTranslations("results.Facets");

  const { toggleFacet } = useFacetContext();

  const [displayedFacets, setDisplayedFacets] =
    useState<FacetItem[]>(facetItems);
  const [sortOrder, setSortOrder] = useState<SortOrder>(DESC);
  const [sortField, setSortField] = useState<SortField>(DOC_COUNT);
  const [searchFacetItem, setSearchFacetItem] = useState<string>("");

  useEffect(() => {
    const sortedFacets = sortFacets(facetItems, sortField, sortOrder);
    const filteredFacets = sortedFacets.filter((facetItem) =>
      facetItem.key.toLowerCase().includes(searchFacetItem.toLowerCase()),
    );
    setDisplayedFacets(filteredFacets);
  }, [sortOrder, sortField, searchFacetItem, facetItems]);

  const sortButtonCommonProps = {
    size: "small" as const,
    color: "inherit" as const,
    disableRipple: true,
    sx: {
      p: 0,
    },
  };

  return (
    <>
      <InputBase
        fullWidth
        size="small"
        placeholder={t(`${facetTitle}.inputPlaceholder`)}
        endAdornment={
          <InputAdornment position="end">
            {searchFacetItem !== "" && (
              <IconButton
                size="small"
                aria-label={t("clearInput")}
                disableRipple
                onClick={() => {
                  setSearchFacetItem("");
                }}
              >
                <ClearIcon />
              </IconButton>
            )}
            <SearchIcon />
          </InputAdornment>
        }
        sx={{
          fontSize: "0.8rem",
          backgroundColor: "common.white",
          borderRadius: 1,
          padding: "5px 20px",
        }}
        value={searchFacetItem}
        onChange={(event) => {
          setSearchFacetItem(event.target.value);
        }}
      />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        py={0.5}
        color="colors.darkBlack"
      >
        <Box display="flex" alignItems="center" ml="20px">
          <IconButton
            title={t("sortAsc")}
            aria-label={t("sortAsc")}
            onClick={() => {
              setSortField(KEY);
              setSortOrder(ASC);
            }}
            {...sortButtonCommonProps}
          >
            <ArrowDropUpIcon />
          </IconButton>
          <IconButton
            title={t("sortDesc")}
            aria-label={t("sortDesc")}
            onClick={() => {
              setSortField(KEY);
              setSortOrder(DESC);
            }}
            {...sortButtonCommonProps}
          >
            <ArrowDropDownIcon />
          </IconButton>
        </Box>
        <Box display="flex" alignItems="center" mr="12px">
          <IconButton
            title={t("sortAsc")}
            aria-label={t("sortAsc")}
            onClick={() => {
              setSortField(DOC_COUNT);
              setSortOrder(ASC);
            }}
            {...sortButtonCommonProps}
          >
            <ArrowDropUpIcon />
          </IconButton>
          <IconButton
            title={t("sortDesc")}
            aria-label={t("sortDesc")}
            onClick={() => {
              setSortField(DOC_COUNT);
              setSortOrder(DESC);
            }}
            {...sortButtonCommonProps}
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
        {displayedFacets.map((facetItem) => (
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
