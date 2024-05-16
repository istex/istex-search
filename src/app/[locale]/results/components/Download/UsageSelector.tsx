"use client";

import { useTranslations } from "next-intl";
import Selector from "@/components/Selector";
import { usages, type UsageName } from "@/config";
import { useHistoryContext } from "@/contexts/HistoryContext";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "@/lib/hooks";
import type { ClientComponent } from "@/types/next";

const UsageSelector: ClientComponent = () => {
  const t = useTranslations("config.usages");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const history = useHistoryContext();

  const handleChange = (_: React.SyntheticEvent, newValue: UsageName) => {
    searchParams.setUsageName(newValue);

    const formatToSelect = usages[newValue].formats;
    searchParams.setFormats(formatToSelect);

    history.populateCurrentRequest({
      date: Date.now(),
      searchParams,
    });

    router.replace(`${pathname}?${searchParams.toString()}`, { scroll: false });
  };

  return (
    <Selector
      value={searchParams.getUsageName()}
      onChange={handleChange}
      options={Object.keys(usages)}
      t={(usage) => t(`${usage}.label`)}
    />
  );
};

export default UsageSelector;
