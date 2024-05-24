"use client";

import { Box, Container } from "@mui/material";
import AssistedSearchInput from "./AssistedSearch/AssistedSearchInput";
import ImportInput from "./ImportInput";
import RegularSearchInput from "./RegularSearchInput";
import {
  SEARCH_MODE_ASSISTED,
  SEARCH_MODE_IMPORT,
  SEARCH_MODE_REGULAR,
} from "@/config";
import { useSearchParams } from "@/lib/hooks";

export default function SearchSection() {
  const searchParams = useSearchParams();
  const searchMode = searchParams.getSearchMode();

  const getSearchComponent = () => {
    switch (searchMode) {
      case SEARCH_MODE_REGULAR:
        return <RegularSearchInput />;
      case SEARCH_MODE_ASSISTED:
        return <AssistedSearchInput />;
      case SEARCH_MODE_IMPORT:
        return <ImportInput />;
    }
  };

  return (
    <Container component="section" sx={{ py: 3 }}>
      <Box
        sx={{
          justifyContent: "flex-end",
        }}
      >
        {getSearchComponent()}
      </Box>
    </Container>
  );
}
