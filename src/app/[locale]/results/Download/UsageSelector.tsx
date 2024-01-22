"use client";

import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";
import Selector from "@/components/Selector";
import { usages, type UsageName } from "@/config";
import useSearchParams from "@/lib/useSearchParams";
import type { ClientComponent } from "@/types/next";

const UsageSelector: ClientComponent = () => {
  const t = useTranslations("config.usages");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (_: React.SyntheticEvent, newValue: UsageName) => {
    searchParams.setUsageName(newValue);

    const formatToSelect = usages[newValue].formats;
    searchParams.setFormats(formatToSelect);

    router.replace(`${pathname}?${searchParams.toString()}`, { scroll: false });
  };

  return (
    <Selector
      value={searchParams.getUsageName()}
      onChange={
        handleChange as (
          event: React.SyntheticEvent<Element, Event>,
          value: string,
        ) => void
      }
      options={Object.keys(usages)}
      t={(usage) => t(`${usage}.label`)}
    />
  );
};

export default UsageSelector;
