"use client";

import { type MouseEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { UploadFileIcon } from "@/mui/icons-material";
import {
  Box,
  Container,
  ToggleButton,
  ToggleButtonGroup,
} from "@/mui/material";
import SearchInput from "./SearchInput";
import { type QueryMode, queryModes } from "@/config";
import type { ClientComponent } from "@/types/next";

const SearchSection: ClientComponent = () => {
  const t = useTranslations("config.queryModes");

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
      currentQueryModeUi = <SearchInput />;
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
              {t(`${name}.label`)}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {currentQueryModeUi}
    </Container>
  );
};

export default SearchSection;
