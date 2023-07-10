import { useTranslations } from "next-intl";
import SearchForm, { type SearchFormLabels } from "./SearchForm";
import type { ServerComponent } from "@/types/next";

const SearchSection: ServerComponent = () => {
  const t = useTranslations("home.SearchForm");
  const tConfig = useTranslations("config");

  const labels: SearchFormLabels = {
    SearchInput: {
      RegularSearchInput: {
        searchTitle: t("SearchInput.RegularSearchInput.searchTitle"),
        resultsTitle: t("SearchInput.RegularSearchInput.resultsTitle"),
        placeholder: t("SearchInput.RegularSearchInput.placeholder"),
        button: t("SearchInput.RegularSearchInput.button"),
        emptyQueryError: t("SearchInput.RegularSearchInput.emptyQueryError"),
      },
      switch: t("SearchInput.switch"),
    },
    ImportInput: {
      placeholder: t("ImportInput.placeholder"),
      button: t("ImportInput.button"),
      emptyQueryError: t("ImportInput.emptyQueryError"),
    },
    queryModes: {
      search: tConfig("queryModes.search.label"),
    },
  };

  return <SearchForm labels={labels} />;
};

export default SearchSection;
