import { useTranslations } from "next-intl";
import SearchForm, { type SearchFormLabels } from "./SearchForm";
import type { ServerComponent } from "@/types/next";

const SearchSection: ServerComponent = () => {
  const t = useTranslations();

  const labels: SearchFormLabels = {
    SearchInput: {
      RegularSearchInput: {
        searchTitle: t("SearchForm.SearchInput.RegularSearchInput.searchTitle"),
        resultsTitle: t(
          "SearchForm.SearchInput.RegularSearchInput.resultsTitle"
        ),
        placeholder: t("SearchForm.SearchInput.RegularSearchInput.placeholder"),
        button: t("SearchForm.SearchInput.RegularSearchInput.button"),
        emptyQueryError: t(
          "SearchForm.SearchInput.RegularSearchInput.emptyQueryError"
        ),
      },
      switch: t("SearchForm.SearchInput.switch"),
    },
    ImportInput: {
      placeholder: t("SearchForm.ImportInput.placeholder"),
      button: t("SearchForm.ImportInput.button"),
      emptyQueryError: t("SearchForm.ImportInput.emptyQueryError"),
    },
    queryModes: {
      search: t("queryModes.search.label"),
    },
  };

  return <SearchForm labels={labels} />;
};

export default SearchSection;
