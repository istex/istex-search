"use client";

import { useState } from "react";
import { Box, Container } from "@mui/material";
import AssistedSearchInput from "./AssistedSearchInput";
import SearchInput from "./SearchInput";
import type { ClientComponent } from "@/types/next";

const SearchSection: ClientComponent<{ loading?: boolean }> = ({ loading }) => {
  const [isAssistedSearch, setIsAssistedSearch] = useState(false);

  return (
    <Container component="section" sx={{ py: 3 }}>
      <Box
        sx={{
          justifyContent: "flex-end",
        }}
      >
        {isAssistedSearch ? (
          <AssistedSearchInput
            switchAssistedSearch={() => {
              setIsAssistedSearch(false);
            }}
          />
        ) : (
          <SearchInput
            loading={loading}
            switchAssistedSearch={() => {
              setIsAssistedSearch(true);
            }}
          />
        )}
      </Box>
    </Container>
  );
};

export default SearchSection;
