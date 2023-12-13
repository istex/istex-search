"use client";

import { useState } from "react";
import { Box, Container, FormControlLabel, Switch } from "@mui/material";
import AssistedSearchInput from "./AssistedSearchInput";
import SearchInput from "./SearchInput";
import type { ClientComponent } from "@/types/next";

const SearchSection: ClientComponent = () => {
  const [isAssistedSearch, setIsAssistedSearch] = useState(false);

  return (
    <Container component="section" sx={{ py: 3 }}>
      <Box
        sx={{
          justifyContent: "flex-end",
        }}
      >
        <FormControlLabel
          control={
            <Switch
              id="assisted-search-toggle"
              value={isAssistedSearch}
              onChange={() => {
                setIsAssistedSearch(!isAssistedSearch);
              }}
            />
          }
          label="assistedSearchInput <=> regularSearchInput"
          sx={{ display: "none" }} // TODO: Remove when the assisted search is implemented
        />
        {isAssistedSearch ? (
          <AssistedSearchInput
          // switchSearchMode={() => {
          //   setIsAssistedSearch(false);
          // }}
          />
        ) : (
          <SearchInput
          // switchSearchMode={() => {
          //   setIsAssistedSearch(false);
          // }}
          />
        )}
      </Box>
    </Container>
  );
};

export default SearchSection;
