"use client";

import { type MouseEvent, useState } from "react";
import { useTranslations } from "next-intl";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Box, Container, ToggleButton, ToggleButtonGroup } from "@mui/material";
import ImportInput from "./ImportInput";
import SearchInput from "./SearchInput";
import { type QueryMode, DEFAULT_QUERY_MODE, queryModes } from "@/config";
import type { ClientComponent } from "@/types/next";

const SearchSection: ClientComponent = () => {
  const t = useTranslations("config.queryModes");
  const [queryMode, setQueryMode] = useState<QueryMode>(DEFAULT_QUERY_MODE);

  const handleQueryModeChange = (
    _: MouseEvent<HTMLElement>,
    newQueryMode: QueryMode | null,
  ) => {
    if (newQueryMode != null) {
      setQueryMode(newQueryMode);
    }
  };

  let currentQueryModeUi;
  switch (queryMode) {
    case "search":
      currentQueryModeUi = <SearchInput />;
      break;
    case "import":
      currentQueryModeUi = <ImportInput />;
      break;
  }

  return (
    <Container component="section" sx={{ py: 3 }}>
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
          {Object.keys(queryModes).map((mode) => (
            <ToggleButton key={mode} value={mode}>
              <UploadFileIcon />
              {t(`${mode}.label`)}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {currentQueryModeUi}
    </Container>
  );
};

export default SearchSection;
