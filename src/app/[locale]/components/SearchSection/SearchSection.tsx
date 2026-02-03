"use client";

import { Container } from "@mui/material";
import {
  SEARCH_MODE_ASSISTED,
  SEARCH_MODE_IMPORT,
  SEARCH_MODE_REGULAR,
} from "@/config";
import { useSearchParams } from "@/lib/hooks";
import AssistedSearchInput from "./AssistedSearch/AssistedSearchInput";
import ImportInput from "./ImportInput";
import RegularSearchInput from "./RegularSearchInput";

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
      {getSearchComponent()}
    </Container>
  );
}
