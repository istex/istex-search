"use client";

import { Container, Skeleton, Stack } from "@mui/material";
import {
  examples,
  SEARCH_MODE_ASSISTED,
  SEARCH_MODE_IMPORT,
  SEARCH_MODE_REGULAR,
  searchModes,
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

// This replicates the RegularSearchInput.
export function SearchSectionLoadingSkeleton() {
  return (
    <Container sx={{ py: 3 }}>
      <Stack spacing={1}>
        {/* SearchTitle */}
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          {/* Title */}
          <Skeleton variant="text" width="20ch" sx={{ fontSize: "1.5rem" }} />

          {/* Search mode buttons */}
          <Stack direction="row" spacing={1}>
            {searchModes.map((mode) => (
              <Skeleton key={mode} width={40} height={40} />
            ))}
          </Stack>
        </Stack>

        {/* Input */}
        <Skeleton height={65} />

        {/* ExampleList */}
        <Stack spacing={1} sx={{ pt: 1 }}>
          {/* Title */}
          <Skeleton variant="text" width="20ch" sx={{ fontSize: "0.875rem" }} />

          {/* Buttons */}
          <Stack direction="row" spacing={2}>
            {examples.map((example) => (
              <Skeleton key={example} width={110} height={30} />
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}
