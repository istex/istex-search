import {
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  type SelectChangeEvent,
  type SelectProps,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import {
  type ArchiveType,
  type CompressionLevel,
  compressionLevels,
  usages,
} from "@/config";
import {
  useArchiveType,
  useCompressionLevel,
  useUsageName,
} from "@/lib/searchParams";

export default function ArchiveSettings() {
  const t = useTranslations("download.ArchiveSettings");
  const tConfig = useTranslations("config");
  const [archiveType, setArchiveType] = useArchiveType();
  const [compressionLevel, setCompressionLevel] = useCompressionLevel();
  const [usageName] = useUsageName();
  const usage = usages[usageName];
  const theme = useTheme();
  const fontSize = theme.typography.fontSize;

  const handleArchiveTypeChange = (event: SelectChangeEvent<ArchiveType>) => {
    setArchiveType(event.target.value);
  };

  const handleCompressionLevelChange = (
    event: SelectChangeEvent<CompressionLevel>,
  ) => {
    setCompressionLevel(event.target.value);
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
          disabled={usage.archiveTypes.length === 1}
          value={archiveType}
          onChange={handleArchiveTypeChange}
        >
          {usage.archiveTypes.map((value) => (
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
