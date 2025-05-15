import * as React from "react";
import { useTranslations } from "next-intl";
import {
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  Stack,
  type SelectChangeEvent,
  type SelectProps,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  compressionLevels,
  usages,
  type ArchiveType,
  type CompressionLevel,
} from "@/config";
import { useHistoryContext } from "@/contexts/HistoryContext";
import { usePathname, useRouter } from "@/i18n/routing";
import { useSearchParams } from "@/lib/hooks";

export default function ArchiveSettings() {
  const t = useTranslations("download.ArchiveSettings");
  const tConfig = useTranslations("config");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const archiveType = searchParams.getArchiveType();
  const compressionLevel = searchParams.getCompressionLevel();
  const currentUsage = usages[searchParams.getUsageName()];
  const history = useHistoryContext();
  const theme = useTheme();
  const fontSize = theme.typography.fontSize;

  const handleArchiveTypeChange = (event: SelectChangeEvent<ArchiveType>) => {
    searchParams.setArchiveType(event.target.value);
    common();
  };

  const handleCompressionLevelChange = (
    event: SelectChangeEvent<CompressionLevel>,
  ) => {
    searchParams.setCompressionLevel(event.target.value);
    common();
  };

  const common = () => {
    history.populateCurrentRequest({
      date: Date.now(),
      searchParams,
    });

    router.replace(`${pathname}?${searchParams.toString()}`, { scroll: false });
  };

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      sx={{
        justifyContent: "space-between",
      }}
    >
      {/* Archive type */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: "center",
        }}
      >
        <InputLabel
          sx={{
            fontSize,
            color: "colors.lightBlack",
          }}
        >
          {t("archiveType")}
        </InputLabel>
        <Select
          id="archive-type-select"
          labelId="archive-type-label"
          disabled={currentUsage.archiveTypes.length === 1}
          value={archiveType}
          onChange={handleArchiveTypeChange}
        >
          {currentUsage.archiveTypes.map((value) => (
            <MenuItem key={value} value={value} sx={{ fontSize }}>
              {tConfig(`archiveTypes.${value}`)}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      {/* Compression level */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: "center",
        }}
      >
        <InputLabel
          sx={{
            fontSize,
            color: "colors.lightBlack",
          }}
        >
          {t("compressionLevel")}
        </InputLabel>
        <Select
          id="compression-level-select"
          labelId="compression-level-label"
          value={compressionLevel}
          onChange={handleCompressionLevelChange}
        >
          {compressionLevels.map((value) => (
            <MenuItem key={value} value={value} sx={{ fontSize }}>
              {tConfig(`compressionLevels.${value}`)}
            </MenuItem>
          ))}
        </Select>
      </Stack>
    </Stack>
  );
}

function Select<T>(props: SelectProps<T>) {
  const { children, ...rest } = props;
  const theme = useTheme();
  const fontSize = theme.typography.fontSize;

  return (
    <MuiSelect
      autoWidth
      variant="standard"
      sx={{
        fontSize,
        fontWeight: "bold",
        "&:before": {
          borderBottom: "none",
        },
        "&:hover:not(.Mui-disabled):before": {
          borderBottom: "none",
        },
        "&.Mui-disabled:before": {
          borderBottom: "none",
        },
        "&:after": {
          borderBottom: "none",
        },
        "& .MuiSelect-select:focus": {
          backgroundColor: "unset",
        },
      }}
      {...rest}
    >
      {children}
    </MuiSelect>
  );
}
