import CancelIcon from "@mui/icons-material/Cancel";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Reply";
import {
  Box,
  IconButton,
  type IconButtonProps,
  Skeleton,
  Stack,
  SvgIcon,
  TableCell,
  TableRow,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import {
  type HistoryEntry,
  setCurrentRequestInLocalStorage,
  useHistoryContext,
} from "@/contexts/HistoryContext";
import { useRouter } from "@/i18n/navigation";
import { buildExtractParamsFromFormats } from "@/lib/formats";
import { useDownload, useShare } from "@/lib/hooks";
import { buildFullApiUrl } from "@/lib/istexApi";
import {
  getIdsFromQueryString,
  getIdTypeFromQueryString,
} from "@/lib/queryIds";
import { getQueryStringFromQId, loadSearchParams } from "@/lib/searchParams";
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
  const {
    queryString,
    qId,
    size,
    formats,
    filters,
    sortBy,
    sortDirection,
    randomSeed,
  } = loadSearchParams(entry.searchParams);
  const queryStringQuery = useQuery({
    queryKey: ["history-query-string", entry.date],
    queryFn: async () => {
      if (queryString != null) {
        return queryString;
      }

      if (qId == null) {
        return "";
      }

      return await getQueryStringFromQId(qId);
    },
  });
  const idType = getIdTypeFromQueryString(queryStringQuery.data ?? "");

  const handleEdit = () => {
    setCurrentRequestInLocalStorage(entry);

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
    const url = new URL(window.location.pathname, window.location.origin);
    url.search = entry.searchParams;

    share("corpus", url);
  };

  const handleDownload = () => {
    const url = buildFullApiUrl({
      queryString: queryString ?? undefined,
      qId: qId ?? undefined,
      selectedFormats: formats,
      size,
      filters,
      sortBy,
      sortDirection,
      randomSeed: randomSeed ?? undefined,
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
          {buildExtractParamsFromFormats(formats)
            .split(";")
            .map((format, i) => (
              <Box key={i}>{format}</Box>
            ))}
        </Box>
      </TableCell>

      {/* Size */}
      <TableCell>{size !== 0 ? size.toLocaleString(locale) : ""}</TableCell>

      {/* SortBy */}
      <TableCell>{tSorting(sortBy)}</TableCell>

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
              <ShareIcon style={{ transform: "scaleX(-1.3) scaleY(1.3)" }} />
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
