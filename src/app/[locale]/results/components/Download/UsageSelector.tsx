import { useTranslations } from "next-intl";
import Selector from "@/components/Selector";
import { type UsageName, usageNames, usages } from "@/config";
import {
  useArchiveType,
  useSelectedFormats,
  useUsageName,
} from "@/lib/searchParams";

export default function UsageSelector() {
  const t = useTranslations("config.usages");
  const [, setSelectedFormats] = useSelectedFormats();
  const [usageName, setUsageName] = useUsageName();
  const [archiveType, setArchiveType] = useArchiveType();

  const handleChange = (_: React.SyntheticEvent, newValue: UsageName) => {
    const newUsage = usages[newValue];

    setUsageName(newValue);
    setSelectedFormats(newUsage.formats);

    // If the new usage doesn't support the current archive type, set the
    // archive type to the first one supported by this usage.
    const newArchiveType = newUsage.archiveTypes.includes(archiveType)
      ? archiveType
      : newUsage.archiveTypes[0];
    setArchiveType(newArchiveType);
  };

  return (
    <Selector
      value={usageName}
      onChange={handleChange}
      options={usageNames}
      t={(usage) => t(`${usage}.label`)}
    />
  );
}
