"use client";

import { useLocale, useTranslations } from "next-intl";
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
  TableCell,
  TableRow,
  type IconButtonProps,
} from "@mui/material";
import ShareIcon from "@/../public/share.svg?svgr";
import {
  useHistoryContext,
  type HistoryEntry,
} from "@/contexts/HistoryContext";
import { useRouter, type Locale } from "@/i18n/navigation";
import { buildExtractParamsFromFormats } from "@/lib/formats";
import { useDownload, useShare } from "@/lib/hooks";
import { buildFullApiUrl } from "@/lib/istexApi";
import {
  getIdsFromQueryString,
  getIdTypeFromQueryString,
} from "@/lib/queryIds";
import { formatDate, lineclamp } from "@/lib/utils";
import type { ClientComponent } from "@/types/next";

interface HistoryItemProps {
  entry: HistoryEntry;
  onClose: () => void;
  index?: number;
  isCurrentRequest?: boolean;
}

const HistoryItem: ClientComponent<HistoryItemProps> = ({
  entry,
  onClose,
  index = 0,
  isCurrentRequest = false,
}) => {
  const t = useTranslations("results.History");
  const tSorting = useTranslations("results.ResultsGrid.sorting");
  const router = useRouter();
  const locale = useLocale() as Locale;
  const history = useHistoryContext();
  const share = useShare();
  const download = useDownload();
  const queryStringQuery = useQuery({
    queryKey: ["history-query-string", entry.date],
    queryFn: async () => await entry.searchParams.getQueryString(),
  });
  const idType = getIdTypeFromQueryString(queryStringQuery.data ?? "");

  const handleEdit = () => {
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

    share(url);
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
      aria-label={isCurrentRequest ? t("currentRequestAriaLabel") : undefined}
      sx={(theme) => ({
        "&:nth-of-type(even)": {
          backgroundColor: theme.palette.action.hover,
        },
        "& td, th": {
          border: 0,
        },
      })}
    >
      {/* Index */}
      <TableCell>{index + 1}</TableCell>

      {/* Query string */}
      <TableCell width="100%">
        <Box
          sx={lineclamp(3)}
          title={!queryStringQuery.isLoading ? queryStringQuery.data : ""}
        >
          {queryStringQuery.isLoading ? (
            // 2 text skeletons while loading
            <Stack>
              {Array(2)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} variant="text" />
                ))}
            </Stack>
          ) : idType != null ? (
            // Get the IDs if ID query string
            getIdsFromQueryString(idType, queryStringQuery.data ?? "")
              .slice(0, 4)
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
      <TableCell>
        {entry.searchParams.getSize().toLocaleString(locale)}
      </TableCell>

      {/* SortBy */}
      <TableCell>{tSorting(entry.searchParams.getSortBy())}</TableCell>

      {/* Date */}
      <TableCell>{formatDate(entry.date, locale)}</TableCell>

      {/* Actions */}
      <TableCell>
        <Stack direction="row">
          <ActionButton
            title={t("editAriaLabel")}
            iconComponent={EditIcon}
            onClick={handleEdit}
          />
          <ActionButton
            title={t("shareAriaLabel")}
            disabled={isCurrentRequest}
            iconComponent={ShareIcon}
            onClick={handleShare}
          />
          <ActionButton
            title={t("downloadAriaLabel")}
            disabled={isCurrentRequest}
            iconComponent={DownloadIcon}
            onClick={handleDownload}
          />
          <ActionButton
            title={t("deleteAriaLabel")}
            disabled={isCurrentRequest}
            iconComponent={CancelIcon}
            color="error"
            onClick={handleDelete}
          />
        </Stack>
      </TableCell>
    </TableRow>
  );
};

interface ActionButtonProps extends IconButtonProps {
  iconComponent: React.FC | typeof SvgIcon;
}

const ActionButton: ClientComponent<ActionButtonProps> = (props) => {
  const { title, color, iconComponent: icon, ...rest } = props;

  return (
    <IconButton
      size="small"
      title={title}
      aria-label={title}
      color={color ?? "primary"}
      {...rest}
    >
      <SvgIcon component={icon} />
    </IconButton>
  );
};

export default HistoryItem;
