import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import CancelIcon from "@mui/icons-material/Cancel";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  IconButton,
  Stack,
  Skeleton,
  SvgIcon,
  TableRow,
  TableCell,
  type IconButtonProps,
} from "@mui/material";
import ShareIcon from "@/../public/share.svg";
import {
  useHistoryContext,
  type HistoryEntry,
} from "@/contexts/HistoryContext";
import { useRouter } from "@/i18n/routing";
import { buildExtractParamsFromFormats } from "@/lib/formats";
import { useDownload, useShare } from "@/lib/hooks";
import { buildFullApiUrl } from "@/lib/istexApi";
import {
  getIdsFromQueryString,
  getIdTypeFromQueryString,
} from "@/lib/queryIds";
import { formatDate, lineclamp } from "@/lib/utils";

interface HistoryItemProps {
  entry: HistoryEntry;
  onClose: () => void;
  index?: number;
  isCurrentRequest?: boolean;
}

const LINE_COUNT = 2;

export default function HistoryItem({
  entry,
  onClose,
  index = 0,
  isCurrentRequest = false,
}: HistoryItemProps) {
  const t = useTranslations("History");
  const tSorting = useTranslations("results.Sorting");
  const router = useRouter();
  const locale = useLocale();
  const history = useHistoryContext();
  const share = useShare();
  const download = useDownload();
  const queryStringQuery = useQuery({
    queryKey: ["history-query-string", entry.date],
    queryFn: async () => await entry.searchParams.getQueryString(),
  });
  const idType = getIdTypeFromQueryString(queryStringQuery.data ?? "");
  const size = entry.searchParams.getSize();

  const handleEdit = () => {
    history.populateCurrentRequest(entry);

    localStorage.setItem(
      "selectedDocuments",
      JSON.stringify(entry.selectedDocuments ?? []),
    );
    localStorage.setItem(
      "excludedDocuments",
      JSON.stringify(entry.excludedDocuments ?? []),
    );

    router.push(`/results?${entry.searchParams.toString()}`);
    onClose();
  };

  const handleShare = () => {
    // Create the share URL and copy the search params from the entry to it.
    // We can't simply do url.searchParams = entry.searchParams because url.searchParams is read-only.
    const url = new URL(window.location.pathname, window.location.origin);
    for (const [key, value] of entry.searchParams) {
      url.searchParams.set(key, value);
    }

    share("corpus", url);
  };

  const handleDownload = () => {
    // We use the native search params instead of getQueryString() to get the query string or the q_id here
    // because it's asynchronous and we don't wan't to get the corresponding query string if a q_id is present,
    // we just want to pass it as is.
    const nativeSearchParams = entry.searchParams.toNative();
    const queryString = nativeSearchParams.get("q") ?? undefined;
    const qId = nativeSearchParams.get("q_id") ?? undefined;

    const url = buildFullApiUrl({
      queryString,
      qId,
      selectedFormats: entry.searchParams.getFormats(),
      size: entry.searchParams.getSize(),
      filters: entry.searchParams.getFilters(),
      sortBy: entry.searchParams.getSortBy(),
      sortDir: entry.searchParams.getSortDirection(),
      randomSeed: entry.searchParams.getRandomSeed(),
    });

    download(url);
  };

  const handleDelete = () => {
    history.delete(index);
  };

  return (
    <TableRow
      sx={(theme) => ({
        "&:nth-of-type(even)": {
          backgroundColor: theme.vars.palette.action.hover,
        },
        "& td, th": {
          border: 0,
        },
      })}
    >
      <TableCell>{index + 1}</TableCell>

      <TableCell width="100%">
        <Box
          sx={lineclamp(3)}
          title={!queryStringQuery.isLoading ? queryStringQuery.data : ""}
        >
          {queryStringQuery.isLoading ? (
            // 2 text skeletons while loading
            <Stack>
              {Array(LINE_COUNT)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} variant="text" />
                ))}
            </Stack>
          ) : idType != null ? (
            // Get the IDs if ID query string
            getIdsFromQueryString(idType, queryStringQuery.data ?? "")
              .slice(0, LINE_COUNT + 1)
              .map((id) => <Box key={id}>{id}</Box>)
          ) : (
            // Raw query string
            queryStringQuery.data
          )}
        </Box>
      </TableCell>

      {/* Formats */}
      <TableCell>
        <Box sx={lineclamp(3)}>
          {buildExtractParamsFromFormats(entry.searchParams.getFormats())
            .split(";")
            .map((format, i) => (
              <Box key={i}>{format}</Box>
            ))}
        </Box>
      </TableCell>

      {/* Size */}
      <TableCell>{size !== 0 ? size.toLocaleString(locale) : ""}</TableCell>

      {/* SortBy */}
      <TableCell>{tSorting(entry.searchParams.getSortBy())}</TableCell>

      {/* Date */}
      <TableCell>{formatDate(entry.date, locale)}</TableCell>

      {/* Actions */}
      <TableCell>
        <Stack direction="row">
          <ActionButton
            title={t("editAriaLabel")}
            icon={<SvgIcon component={EditIcon} />}
            onClick={handleEdit}
          />
          <ActionButton
            title={t("shareAriaLabel")}
            icon={
              <Image
                src={ShareIcon}
                alt=""
                style={{
                  // Only way I found to change the color of the SVG when it's used as the "src" attribute of an <img> tag.
                  // This filter was generated with https://angel-rs.github.io/css-color-filter-generator/ with the primary color from
                  // the MUI theme (#458ca5).
                  filter:
                    "brightness(0) saturate(100%) invert(53%) sepia(7%) saturate(2888%) hue-rotate(150deg) brightness(93%) contrast(89%)",
                }}
              />
            }
            onClick={handleShare}
          />
          <ActionButton
            title={t("downloadAriaLabel")}
            disabled={isCurrentRequest}
            icon={<SvgIcon component={DownloadIcon} />}
            onClick={handleDownload}
          />
          <ActionButton
            title={t("deleteAriaLabel")}
            disabled={isCurrentRequest}
            icon={<SvgIcon component={CancelIcon} />}
            color="error"
            onClick={handleDelete}
          />
        </Stack>
      </TableCell>
    </TableRow>
  );
}

interface ActionButtonProps extends IconButtonProps {
  icon: React.ReactNode;
}

function ActionButton(props: ActionButtonProps) {
  const { title, color, icon, ...rest } = props;

  return (
    <IconButton
      size="small"
      title={title}
      aria-label={title}
      color={color ?? "primary"}
      {...rest}
    >
      {icon}
    </IconButton>
  );
}
