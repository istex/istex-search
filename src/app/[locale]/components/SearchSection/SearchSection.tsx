"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { Box, Container } from "@mui/material";
import { useDocumentContext } from "../../results/Document/DocumentContext";
import AssistedSearchInput from "./AssistedSearchInput";
import SearchInput from "./SearchInput";
import type CustomError from "@/lib/CustomError";
import useSearchParams from "@/lib/useSearchParams";
import type { ClientComponent } from "@/types/next";

const SearchSection: ClientComponent<{ loading?: boolean }> = ({ loading }) => {
  const [isAssistedSearch, setIsAssistedSearch] = useState(false);
  const tErrors = useTranslations("errors");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetSelectedExcludedDocuments } = useDocumentContext();

  const goToResultsPage = (
    newQueryString: string,
    setErrorMessage: (errorMessage: string) => void,
    setQueryString?: (queryString: string) => void,
  ) => {
    if (newQueryString.trim() === "") {
      setErrorMessage(tErrors("emptyQueryError"));
      return;
    }

    if (setQueryString !== undefined) setQueryString(newQueryString);
    localStorage.setItem("lastQueryString", newQueryString);

    searchParams.deleteSize();
    searchParams.deletePage();
    searchParams.deleteFilters();
    searchParams
      .setQueryString(newQueryString)
      .then(() => {
        router.push(`/results?${searchParams.toString()}`);
        resetSelectedExcludedDocuments();
      })
      .catch((err: CustomError) => {
        setErrorMessage(tErrors(err.info.name));
      });
  };

  return (
    <Container component="section" sx={{ py: 3 }}>
      <Box
        sx={{
          justifyContent: "flex-end",
        }}
      >
        {isAssistedSearch ? (
          <AssistedSearchInput
            goToResultsPage={goToResultsPage}
            switchAssistedSearch={() => {
              setIsAssistedSearch(false);
            }}
          />
        ) : (
          <SearchInput
            goToResultsPage={goToResultsPage}
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
