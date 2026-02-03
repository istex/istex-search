import { useTranslations } from "next-intl";
import Selector from "@/components/Selector";
import { type UsageName, usages } from "@/config";
import { useHistoryContext } from "@/contexts/HistoryContext";
import { usePathname, useRouter } from "@/i18n/routing";
import { useSearchParams } from "@/lib/hooks";

export default function UsageSelector() {
  const t = useTranslations("config.usages");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const history = useHistoryContext();

  const handleChange = (_: React.SyntheticEvent, newValue: UsageName) => {
    const newUsage = usages[newValue];
    const currentArchiveType = searchParams.getArchiveType();

    searchParams.setUsageName(newValue);
    searchParams.setFormats(newUsage.formats);

    if (!newUsage.archiveTypes.includes(currentArchiveType)) {
      searchParams.setArchiveType(newUsage.archiveTypes[0]);
    }

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
}
