"use client";

import { type MouseEvent, useState } from "react";
import { UploadFileIcon } from "@/mui/icons-material";
import {
  Box,
  Container,
  ToggleButton,
  ToggleButtonGroup,
} from "@/mui/material";
import type { ImportInputLabels } from "./ImportInput";
import SearchInput, { type SearchInputLabels } from "./SearchInput";
import { type QueryMode, queryModes } from "@/config";
import type { ClientComponent } from "@/types/next";

export interface SearchFormLabels {
  SearchInput: SearchInputLabels;
  ImportInput: ImportInputLabels;
  queryModes: Record<QueryMode["name"], string>;
}

const SearchForm: ClientComponent<{ labels: SearchFormLabels }> = ({
  labels,
}) => {
  const [queryMode, setQueryMode] = useState<QueryMode["name"]>(
    queryModes[0].name
  );

  const handleQueryModeChange = (
    _: MouseEvent<HTMLElement>,
    newQueryMode: QueryMode["name"] | null
  ): void => {
    if (newQueryMode != null) {
      setQueryMode(newQueryMode);
    }
  };

  let currentQueryModeUi;
  switch (queryMode) {
    case queryModes[0].name:
      currentQueryModeUi = <SearchInput labels={labels.SearchInput} />;
      break;
  }

  return (
    <Container component="section" sx={{ py: 6 }}>
      <Box
        sx={{
          display: "none", // TODO: change to flex when another query mode is implemented
          justifyContent: "flex-end",
        }}
      >
        <ToggleButtonGroup
          color="primary"
          exclusive
          value={queryMode}
          onChange={handleQueryModeChange}
        >
          {queryModes.map(({ name }) => (
            <ToggleButton key={name} value={name}>
              <UploadFileIcon />
              {labels.queryModes[name]}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {currentQueryModeUi}
    </Container>
  );
};

export default SearchForm;
