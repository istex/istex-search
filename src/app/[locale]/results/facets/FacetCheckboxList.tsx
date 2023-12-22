"use client";

import { createRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton, InputAdornment, InputBase, Stack } from "@mui/material";
import ArrowDownIcon from "./ArrowDownIcon";
import ArrowUpIcon from "./ArrowUpIcon";
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

  const listRef = createRef<HTMLDivElement>();
  const [displayedFacets, setDisplayedFacets] =
    useState<FacetItem[]>(facetItems);
  const [sortOrder, setSortOrder] = useState<SortOrder>();
  const [sortField, setSortField] = useState<SortField>();
  const [searchFacetItem, setSearchFacetItem] = useState<string>("");
  const [isScrollable, setIsScrollable] = useState<boolean>(false);

  useEffect(() => {
    let sortedFacets: FacetItem[] = facetItems;
    if (sortField !== undefined && sortOrder !== undefined) {
      sortedFacets = sortFacets(facetItems, sortField, sortOrder);
    }
    const filteredFacets = sortedFacets.filter((facetItem) =>
      facetItem.key.toLowerCase().includes(searchFacetItem.toLowerCase()),
    );
    setDisplayedFacets(filteredFacets);
  }, [sortOrder, sortField, searchFacetItem, facetItems]);

  useEffect(() => {
    if (listRef.current != null) {
      setIsScrollable(
        listRef.current.clientHeight < listRef.current.scrollHeight,
      );
    }
  }, [listRef]);

  const sortButtonCommonProps = {
    size: "small" as const,
    disableRipple: true,
    sx: {
      p: 0.3125,
      "& .MuiSvgIcon-root": {
        fontSize: "0.625rem",
      },
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
          "& .MuiInputBase-input": {
            padding: 0,
          },
        }}
        value={searchFacetItem}
        onChange={(event) => {
          setSearchFacetItem(event.target.value);
        }}
      />
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        pt={1.25}
        pb={0.625}
        color="colors.darkBlack"
      >
        <Stack direction="row" alignItems="center" ml="25.5px">
          <IconButton
            title={t("sortAsc")}
            aria-label={t("sortAsc")}
            onClick={() => {
              setSortField(KEY);
              setSortOrder(ASC);
            }}
            color={
              sortField === KEY && sortOrder === ASC ? "primary" : "inherit"
            }
            {...sortButtonCommonProps}
          >
            <ArrowUpIcon />
          </IconButton>
          <IconButton
            title={t("sortDesc")}
            aria-label={t("sortDesc")}
            onClick={() => {
              setSortField(KEY);
              setSortOrder(DESC);
            }}
            color={
              sortField === KEY && sortOrder === DESC ? "primary" : "inherit"
            }
            {...sortButtonCommonProps}
          >
            <ArrowDownIcon />
          </IconButton>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          mr={isScrollable ? "28px" : "13.5px"}
        >
          <IconButton
            title={t("sortAsc")}
            aria-label={t("sortAsc")}
            onClick={() => {
              setSortField(DOC_COUNT);
              setSortOrder(ASC);
            }}
            color={
              sortField === DOC_COUNT && sortOrder === ASC
                ? "primary"
                : "inherit"
            }
            {...sortButtonCommonProps}
          >
            <ArrowUpIcon />
          </IconButton>
          <IconButton
            title={t("sortDesc")}
            aria-label={t("sortDesc")}
            onClick={() => {
              setSortField(DOC_COUNT);
              setSortOrder(DESC);
            }}
            color={
              sortField === DOC_COUNT && sortOrder === DESC
                ? "primary"
                : "inherit"
            }
            {...sortButtonCommonProps}
          >
            <ArrowDownIcon />
          </IconButton>
        </Stack>
      </Stack>
      <Stack maxHeight={140} overflow="auto" ref={listRef}>
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
      </Stack>
    </>
  );
};

export default FacetCheckboxList;
